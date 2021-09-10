type RoomRosters = Map<string, Set<string>>;

declare global {
  interface RoomHeap {
    rosters: RoomRosters;
  }
}

function getRosterFromMap(map: RoomRosters, role: string): Set<string> {
  var roleRoster = map.get(role);
  if (!roleRoster) {
    roleRoster = new Set();
    map.set(role, roleRoster);
  }
  return roleRoster;
}

function addToRosterMap(map: RoomRosters, role: string, creepName: string) {
  var roleRoster = getRosterFromMap(map, role);
  roleRoster.add(creepName);
}

function removeFromRosterMap(
  map: RoomRosters,
  role: string,
  creepName: string
) {
  map.get(role)?.delete(creepName);
}

function getAllRosters(room: Room): RoomRosters {
  if (!room.heap.rosters) {
    let allRosters = new Map();

    room.find(FIND_MY_CREEPS).forEach((creep) => {
      addToRosterMap(allRosters, creep.memory.role, creep.name);
    });

    room.heap.rosters = allRosters;
  }
  return room.heap.rosters;
}

function getRoleRoster(room: Room, role: string) {
  var allRosters = getAllRosters(room);
  return getRosterFromMap(allRosters, role);
}

export function getRoomRoster(room: Room): RoomRosters {
  return new Map(getAllRosters(room));
}

export function getRoomRosterForRole(room: Room, role: string): string[] {
  return Array.from(getRoleRoster(room, role));
}

export function getRoleCount(room: Room, role: string): number {
  return getRoleRoster(room, role).size;
}

export function getCreepCount(room: Room): number {
  var totalCount = 0;
  getAllRosters(room).forEach((roster) => (totalCount += roster.size));
  return totalCount;
}

export function addCreepNameToRoster(room: Room, creepName: string) {
  var allRosters = getAllRosters(room);
  addToRosterMap(allRosters, Memory.creeps[creepName].role, creepName);
}

export function removeCreepNameFromRoster(room: Room, creepName: string) {
  var allRosters = getAllRosters(room);
  removeFromRosterMap(allRosters, Memory.creeps[creepName].role, creepName);
}

export function logRoomRoster(room: Room) {
  var roomRoster = getAllRosters(room);
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
