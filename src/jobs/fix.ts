export function getNextTarget(creep: Creep): Structure | null {
  const targets = creep.room.find(FIND_STRUCTURES, {
    filter: (site) => site.hits < site.hitsMax,
  });
  const target = null;
  if (targets.length > 0) {
    targets.reduce((mostDamaged, candidate) =>
      candidate.hits < mostDamaged.hits ? candidate : mostDamaged
    );
  }
  return target;
}

export function doWork(creep: Creep, target: Structure): ScreepsReturnCode {
  return creep.repair(target);
}

export function isWorkDone(creep: Creep, target: Structure): boolean {
  return target.hits === target.hitsMax;
}
