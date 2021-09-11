export function getNextTarget(creep: Creep): ConstructionSite | null {
  var sites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
  if (sites.length == 0) {
    return null;
  }

  var targets = sites.filter(
    (site) =>
      site.structureType === STRUCTURE_CONTAINER ||
      site.structureType === STRUCTURE_STORAGE
  );
  if (targets.length == 0) {
    targets = sites.filter(
      (site) =>
        site.structureType === STRUCTURE_RAMPART ||
        site.structureType === STRUCTURE_WALL
    );
  }
  if (targets.length == 0) {
    targets = sites;
  }
  return targets[0];
}

export function doWork(
  creep: Creep,
  target: ConstructionSite
): ScreepsReturnCode {
  return creep.build(target);
}

export function isWorkDone(creep: Creep, target: ConstructionSite): boolean {
  return target === null;
}
