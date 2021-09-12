import { Job } from "../constants/Jobs";
import { BaseLoadout } from "./loadout";

export class Miner extends BaseLoadout {
  constructor() {
    super("Miner", [MOVE, WORK, WORK, WORK, WORK, WORK]);
  }

  init(creep: Creep) {
    super.init(creep);
    creep.memory.role = Job.MINE;
    var freeSource = creep.room.sources.find((source) => !source.miner);
    if (freeSource) {
      freeSource.miner = creep;
    } else {
      console.log(
        "WARNING: Spawning miner in room " +
          creep.room.name +
          " but there are no free mines."
      );
    }
  }

  run(creep: Creep) {
    if (!creep.memory.sourceId) {
      return;
    }

    var source = Game.getObjectById(creep.memory.sourceId);

    if (source) {
      if (source.buffer && creep.pos.isEqualTo(source.buffer.pos)) {
        creep.harvest(source);
      } else {
        creep.moveTo(source.buffer);
      }
    }
  }

  cleanUp(name: string, memory: CreepMemory) {
    super.cleanUp(name, memory);

    if (!memory.sourceId) {
      return;
    }

    var source = Game.getObjectById(memory.sourceId);
    if (source) {
      source.miner = null;
    } else {
      console.log(
        "WARNING: Dying miner " + name + " was pointing at corrupted source: ",
        memory.sourceId
      );
    }
  }
}
