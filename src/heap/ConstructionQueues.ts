class ConstructionQueue extends Array<Object> {
  planned: Record<StructureConstant, RoomPosition[]> = Object.create(null);
}

declare global {
  interface RoomHeap {
    constructionQueues: Record<string, ConstructionQueue>;
  }
}

function getQueues(room: Room): Record<string, ConstructionQueue> {
  room.heap.constructionQueues =
    room.heap.constructionQueues || Object.create(null);
  return room.heap.constructionQueues;
}

function getQueue(room: Room, buildType: string): ConstructionQueue {
  var queues = getQueues(room);
  queues[buildType] = queues[buildType] || new ConstructionQueue();
  return queues[buildType];
}

export function isEmpty(room: Room, buildType: string) {
  return getQueue(room, buildType).length === 0;
}

export function peek(room: Room, buildType: string) {
  return isEmpty(room, buildType) ? undefined : getQueue(room, buildType)[0];
}

export function enqueue(room: Room, buildType: string, project: Object) {
  getQueue(room, buildType).push(project);
}

export function dequeue(room: Room, buildType: string) {
  return getQueue(room, buildType).shift();
}

export function hasPlannedConstruction(room: Room, buildType: string) {
  var plannedWork = getQueue(room, buildType).planned;
  return Object.getOwnPropertyNames(plannedWork).length !== 0;
}

export function getPlannedConstruction(room: Room, buildType: string) {
  return getQueue(room, buildType).planned;
}

export function setPlannedConstruction(
  room: Room,
  buildType: string,
  plans: Record<StructureConstant, RoomPosition[]>
) {
  getQueue(room, buildType).planned = plans;
}
