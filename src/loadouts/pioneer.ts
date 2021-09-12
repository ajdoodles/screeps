import { Job } from "../constants/Jobs";
import JobsTable from "../tables/JobsTable";
import { BaseLoadout } from "./loadout";
import * as RoomRosters from "../heap/RoomRosters";
import { getBodyCost } from "../utils/Utils";

const BASE_NAME = "Pioneer";
const BASE_BODY = [WORK, CARRY, MOVE];

export class Pioneer extends BaseLoadout {
  public static ENERGY_COST = getBodyCost(BASE_BODY);

  constructor() {
    super(BASE_NAME, BASE_BODY);
  }

  init(creep: Creep) {
    super.init(creep);
    creep.memory.fetching = true;
  }

  static clearTarget(creep: Creep) {
    delete creep.memory.targetId;
    delete creep.memory.bufferId;
    delete creep.memory.sourceId;
  }

  static setTarget(creep: Creep, target?: { id: Id<RoomObject> } | null) {
    Pioneer.clearTarget(creep);
    if (target) {
      creep.memory.targetId = target.id;
    }
  }

  static reassignRole(creep: Creep, newRole: Job) {
    if (creep.memory.role === newRole) {
      return;
    }
    RoomRosters.removeCreepNameFromRoster(creep.room, creep.name);
    creep.memory.role = newRole;
    RoomRosters.addCreepNameToRoster(creep.room, creep.name);
    Pioneer.clearTarget(creep);
  }

  static getTarget(creep: Creep): (RoomObject & { id: Id<RoomObject> }) | null {
    return creep.memory.targetId
      ? (Game.getObjectById(creep.memory.targetId) as RoomObject & {
          id: Id<RoomObject>;
        })
      : null;
  }

  run(creep: Creep) {
    let target = Pioneer.getTarget(creep);
    const job = JobsTable[creep.memory.role];

    if (!target) {
      target = job.getNextTarget(creep);
      Pioneer.setTarget(creep, target);
    }

    const canFetchMore = creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    const hasNoEnergy = creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0;
    creep.memory.fetching =
      ((!target || creep.memory.fetching) && canFetchMore) || hasNoEnergy;

    if (creep.memory.fetching) {
      // first fill up on energy
      this.fetchEnergy(creep, target);
    } else if (target) {
      // we have a target
      const result = job.doWork(creep, target); // try to work on it
      if (result == ERR_NOT_IN_RANGE) {
        creep.moveTo(target); // we couldn't work on it, walk towards it
      }

      if (job.isWorkDone(creep, target)) {
        Pioneer.clearTarget(creep);
      }
    } else {
      Pioneer.reassignRole(creep, Job.IDLE);
    }
  }
}
