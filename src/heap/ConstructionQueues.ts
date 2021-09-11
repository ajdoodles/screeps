import { BuildType } from "../constants/BuildTypes";

class ConstructionQueue extends Array<any> {
  planned: Record<BuildableStructureConstant, RoomPosition[]> =
    Object.create(null);
}

declare global {
  interface RoomHeap {
    constructionQueues: Record<BuildType, ConstructionQueue>;
  }
}

function getQueues(room: Room): Record<BuildType, ConstructionQueue> {
  room.heap.constructionQueues =
    room.heap.constructionQueues || Object.create(null);
  return room.heap.constructionQueues;
}

function getQueue(room: Room, buildType: BuildType): ConstructionQueue {
  var queues = getQueues(room);
  queues[buildType] = queues[buildType] || new ConstructionQueue();
  return queues[buildType];
}

export function isEmpty(room: Room, buildType: BuildType) {
  return getQueue(room, buildType).length === 0;
}

export function peek(room: Room, buildType: BuildType) {
  return isEmpty(room, buildType) ? undefined : getQueue(room, buildType)[0];
}

export function enqueue(room: Room, buildType: BuildType, project: Object) {
  getQueue(room, buildType).push(project);
}

export function dequeue(room: Room, buildType: BuildType) {
  return getQueue(room, buildType).shift();
}

export function hasPlannedConstruction(room: Room, buildType: BuildType) {
  var plannedWork = getQueue(room, buildType).planned;
  return Object.getOwnPropertyNames(plannedWork).length !== 0;
}

export function getPlannedConstruction(room: Room, buildType: BuildType) {
  return getQueue(room, buildType).planned;
}

export function setPlannedConstruction(
  room: Room,
  buildType: BuildType,
  plans: Record<StructureConstant, RoomPosition[]>
) {
  getQueue(room, buildType).planned = plans;
}
