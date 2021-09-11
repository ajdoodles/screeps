export function getNextTarget(creep: Creep): StructureController | null {
  return creep.room.controller ?? null;
}

export function doWork(
  creep: Creep,
  target: StructureController
): ScreepsReturnCode {
  return creep.upgradeController(target);
}

export function isWorkDone(): false {
  return false;
}
