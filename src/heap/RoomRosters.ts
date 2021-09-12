import { Job } from "../constants/Jobs";

type RoomRosters = Map<string, Set<string>>;

declare global {
  interface RoomHeap {
    rosters: RoomRosters;
  }
}

function getRosterFromMap(map: RoomRosters, role: Job): Set<string> {
  let roleRoster = map.get(role);
  if (!roleRoster) {
    roleRoster = new Set();
    map.set(role, roleRoster);
  }
  return roleRoster;
}

function addToRosterMap(map: RoomRosters, role: Job, creepName: string) {
  const roleRoster = getRosterFromMap(map, role);
  roleRoster.add(creepName);
}

function removeFromRosterMap(map: RoomRosters, role: Job, creepName: string) {
  map.get(role)?.delete(creepName);
}

function getAllRosters(room: Room): RoomRosters {
  if (!room.heap.rosters) {
    const allRosters = new Map();

    room.find(FIND_MY_CREEPS).forEach((creep) => {
      addToRosterMap(allRosters, creep.memory.role, creep.name);
    });

    room.heap.rosters = allRosters;
  }
  return room.heap.rosters;
}

function getRoleRoster(room: Room, role: Job) {
  const allRosters = getAllRosters(room);
  return getRosterFromMap(allRosters, role);
}

export function getRoomRoster(room: Room): RoomRosters {
  return new Map(getAllRosters(room));
}

export function getRoomRosterForRole(room: Room, role: Job): string[] {
  return Array.from(getRoleRoster(room, role));
}

export function getRoleCount(room: Room, role: Job): number {
  return getRoleRoster(room, role).size;
}

export function getCreepCount(room: Room): number {
  let totalCount = 0;
  getAllRosters(room).forEach((roster) => (totalCount += roster.size));
  return totalCount;
}

export function addCreepNameToRoster(room: Room, creepName: string) {
  const allRosters = getAllRosters(room);
  addToRosterMap(allRosters, Memory.creeps[creepName].role, creepName);
}

export function removeCreepNameFromRoster(room: Room, creepName: string) {
  const allRosters = getAllRosters(room);
  removeFromRosterMap(allRosters, Memory.creeps[creepName].role, creepName);
}

export function logRoomRoster(room: Room) {
  const roomRoster = getAllRosters(room);
  if (roomRoster.size > 0) {
    console.log("CURRENT ROOM ROSTER:");
  } else {
    console.log("ROOM ROSTER EMPTY");
  }
  let log;
  for (const [role, roster] of roomRoster.entries()) {
    log = role + ": ";
    for (const name of roster.values()) {
      log += name + ", ";
    }
    console.log(log);
  }
}
