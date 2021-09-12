export function getNextTarget(
  creep: Creep
): StructureSpawn | StructureExtension {
  const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
    filter: (structure) =>
      (structure.structureType == STRUCTURE_SPAWN ||
        structure.structureType == STRUCTURE_EXTENSION) &&
      structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
  });
  return target as StructureSpawn | StructureExtension;
}

export function doWork(
  creep: Creep,
  target: StructureExtension | StructureSpawn
): ScreepsReturnCode {
  return creep.transfer(target, RESOURCE_ENERGY);
}

export function isWorkDone(
  creep: Creep,
  target: StructureExtension | StructureSpawn
): boolean {
  return target.store.getFreeCapacity(RESOURCE_ENERGY) === 0;
}
