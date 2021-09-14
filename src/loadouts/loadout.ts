import * as RoomRosters from "../heap/RoomRosters";

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
  saveSource(creep: Creep): void;
  harvest(creep: Creep): ScreepsReturnCode;
}

class NaturalSource implements EnergySource<Source> {
  constructor(public source: Source) {}
  saveSource(creep: Creep) {
    creep.memory.sourceId = this.source.id;
  }
  harvest(creep: Creep) {
    return creep.harvest(this.source);
  }
}

class ContainerSource implements EnergySource<StructureContainer> {
  constructor(public source: StructureContainer) {}
  saveSource(creep: Creep) {
    creep.memory.bufferId = this.source.id;
  }
  harvest(creep: Creep) {
    return creep.withdraw(this.source, RESOURCE_ENERGY);
  }
}

export abstract class BaseLoadout implements Loadout {
  constructor(readonly name: string, readonly body: BodyPartConstant[]) {}

  init(creep: Creep): void {
    RoomRosters.addCreepNameToRoster(
      Game.rooms[creep.memory.birthRoom],
      creep.name
    );
  }

  fetchEnergy(creep: Creep, target?: RoomObject | null): void {
    let receiver = target;
    if (!receiver) {
      receiver = creep;
    }

    let energySource: EnergySource<StructureContainer | Source> | undefined;

    if (creep.memory.bufferId) {
      const buffer = Game.getObjectById(creep.memory.bufferId);
      if (buffer) {
        energySource = new ContainerSource(buffer);
      }
    } else if (creep.memory.sourceId) {
      const source = Game.getObjectById(creep.memory.sourceId);
      if (source) {
        energySource = new NaturalSource(source);
      }
    }

    if (!energySource) {
      const buffer = receiver.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (struct: AnyStructure) =>
          (struct.structureType === STRUCTURE_CONTAINER ||
            struct.structureType === STRUCTURE_STORAGE) &&
          struct.store &&
          struct.store.getUsedCapacity(RESOURCE_ENERGY) > 50,
      }) as StructureContainer;
      if (buffer) {
        energySource = new ContainerSource(buffer);
      }
    }

    if (!energySource) {
      const source = receiver.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
      if (source) {
        energySource = new NaturalSource(source);
      }
    }

    if (energySource) {
      energySource.saveSource(creep);
      if (energySource.harvest(creep) == ERR_NOT_IN_RANGE) {
        creep.moveTo(energySource.source, {
          visualizePathStyle: { stroke: "#ffaa00" },
        });
      }
    }
  }

  abstract run(creep: Creep): void;

  cleanUp(name: string, memory: CreepMemory): void {
    RoomRosters.removeCreepNameFromRoster(Game.rooms[memory.birthRoom], name);
  }
}
