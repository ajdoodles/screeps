import * as RoomRosters from "../heap/RoomRosters";
import { getBodyCost } from "../utils/Utils";

interface Loadout {
  readonly name: string;
  readonly body: BodyPartConstant[];
  init(creep: Creep): void;
  fetchEnergy(creep: Creep, target?: RoomObject | null): void;
  run(creep: Creep): void;
  cleanUp(name: string, memory: CreepMemory): void;
}

interface EnergySource<T> {
  source: T;
  harvest(creep: Creep): ScreepsReturnCode;
}

class NaturalSource implements EnergySource<Source> {
  constructor(public source: Source) {}
  harvest(creep: Creep) {
    return creep.harvest(this.source);
  }
}

class ContainerSource implements EnergySource<StructureContainer> {
  constructor(public source: StructureContainer) {}
  harvest(creep: Creep) {
    return creep.withdraw(this.source, RESOURCE_ENERGY);
  }
}

export abstract class BaseLoadout implements Loadout {
  constructor(readonly name: string, readonly body: BodyPartConstant[]) {}

  init(creep: Creep) {
    RoomRosters.addCreepNameToRoster(
      Game.rooms[creep.memory.birthRoom],
      creep.name
    );
  }

  fetchEnergy(creep: Creep, target?: RoomObject | null) {
    var receiver = target;
    if (!receiver) {
      receiver = creep;
    }

    var energySource: EnergySource<StructureContainer | Source> | undefined;

    if (creep.memory.bufferId) {
      let buffer = Game.getObjectById(creep.memory.bufferId);
      if (buffer) {
        energySource = new ContainerSource(buffer);
      }
    } else if (creep.memory.sourceId) {
      let source = Game.getObjectById(creep.memory.sourceId);
      if (source) {
        energySource = new NaturalSource(source);
      }
    }

    if (!energySource) {
      let buffer = receiver.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (struct: AnyStructure) =>
          (struct.structureType === STRUCTURE_CONTAINER ||
            struct.structureType === STRUCTURE_STORAGE) &&
          struct.store!.getUsedCapacity(RESOURCE_ENERGY) > 50,
      }) as StructureContainer;
      if (buffer) {
        energySource = new ContainerSource(buffer);
      }
    }

    if (!energySource) {
      let source = receiver.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
      if (source) {
        energySource = new NaturalSource(source);
      }
    }

    if (energySource) {
      if (energySource.harvest(creep) == ERR_NOT_IN_RANGE) {
        creep.moveTo(energySource.source, {
          visualizePathStyle: { stroke: "#ffaa00" },
        });
      }
    }
  }

  abstract run(creep: Creep): void;

  cleanUp(name: string, memory: CreepMemory) {
    RoomRosters.removeCreepNameFromRoster(Game.rooms[memory.birthRoom], name);
  }
}
