module.exports = (function () {
  var _getRosterFromMap = function (map, role) {
    if (!map.has(role)) {
      map.set(role, new Set());
    }
    return map.get(role);
  };

  var _addToRosterMap = function (map, role, creepName) {
    var roleRoster = _getRosterFromMap(map, role);
    roleRoster.add(creepName);
  };

  var _removeFromRosterMap = function (map, role, creepName) {
    if (map.has(role)) {
      map.get(role).delete(creepName);
    }
  };

  var _getAllRosters = function (room) {
    if (!room.heap.rosters) {
      let allRosters = new Map();

      room.find(FIND_MY_CREEPS).forEach((creep) => {
        _addToRosterMap(allRosters, creep.memory.role, creep.name);
      });

      room.heap.rosters = allRosters;
    }
    return room.heap.rosters;
  };

  var _getRoleRoster = function (room, role) {
    var allRosters = _getAllRosters(room);
    return _getRosterFromMap(allRosters, role);
  };

  var getRoomRoster = function (room) {
    console.log("getRoomRoster()", room);
    return new Map(_getAllRosters(room));
  };

  var getRoomRosterForRole = function (room, role) {
    console.log("getRoomRosterForRole()", room, role);
    return Array.from(_getRoleRoster(room, role));
  };

  var getRoleCount = function (room, role) {
    console.log("getRoleCount()", room, role);
    return _getRoleRoster(room, role).size;
  };

  var getCreepCount = function (room) {
    console.log("getCreepCount()", room);
    var totalCount = 0;
    _getAllRosters(room).forEach((roster) => (totalCount += roster.length));
    return totalCount;
  };

  var addCreepNameToRoster = function (room, creepName) {
    console.log("addCreepNameToRoster()", room, creepName);
    var allRosters = _getAllRosters(room);
    _addToRosterMap(allRosters, Memory.creeps[creepName].role, creepName);
  };

  var removeCreepNameFromRoster = function (room, creepName) {
    console.log("removeCreepNameFromRoster()", room, creepName);
    var allRosters = _getAllRosters(room);
    _removeFromRosterMap(allRosters, Memory.creeps[creepName].role, creepName);
  };

  var logRoomRoster = function (room) {
    var roomRoster = _getAllRosters(room);
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
  };

  var mPublic = {
    getRoleCount: getRoleCount,
    getCreepCount: getCreepCount,
    getRoomRoster: getRoomRoster,
    getRoomRosterForRole: getRoomRosterForRole,
    addCreepNameToRoster: addCreepNameToRoster,
    removeCreepNameFromRoster: removeCreepNameFromRoster,
    logRoomRoster: logRoomRoster,
  };

  return mPublic;
})();
