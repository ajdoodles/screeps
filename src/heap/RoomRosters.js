module.exports = (function(){

  global.RoomRosters = global.RoomRosters || Object.create(null);

  var _addCreepNameToRoomRoster = function(roomRoster, creepName) {
    if (!roomRoster.has(Memory.creeps[creepName].role)) {
      roomRoster.set(Memory.creeps[creepName].role, new Set());
    }
    roomRoster.get(Memory.creeps[creepName].role).add(creepName);
  };

  var _removeCreepNameFromRoomRoster = function(roomRoster, creepName) {
    var roleRoster = roomRoster.get(Memory.creeps[creepName].role);
    roleRoster.delete(creepName);
    if (roleRoster.size === 0) {
      roomRoster.delete(Memory.creeps[creepName].role);
    }
  };

  var _getRosterForRoom = function(room) {
    if (!global.RoomRosters[room.name]) {
      let roomRoster = new Map();

      room.find(FIND_MY_CREEPS).forEach((creep) => {
        _addCreepNameToRoomRoster(roomRoster, creep.name);
      });

      global.RoomRosters[room.name] = roomRoster;
    }
    return global.RoomRosters[room.name];
  };

  var getRoomRoster = function(room) {
    return new Map(_getRosterForRoom(room));
  };

  var getRoomRosterForRole = function(room, role) {
    var roster = _getRosterForRoom(room).get(role);
    return roster ? Array.from(roster) : [];
  };

  var getRoleCount = function(room, role) {
    return getRoomRosterForRole(room, role).length;
  };

  var getCreepCount = function(room) {
    var totalCount = 0;
    for (const [role, roster] of getRoomRoster(room)) {
      totalCount += roster.length;
    }
    return totalCount;
  };

  var addCreepNameToRoster = function(room, creepName) {
    var roomRoster = _getRosterForRoom(room);
    _addCreepNameToRoomRoster(roomRoster, creepName);
  };

  var removeCreepNameFromRoster = function(room, creepName) {
    var roomRoster = _getRosterForRoom(room);
    _removeCreepNameFromRoomRoster(roomRoster, creepName);
  };

  var logRoomRoster = function(room) {
    var roomRoster = _getRosterForRoom(room);
    if (roomRoster.size > 0) {
      console.log('CURRENT ROOM ROSTER:');
    } else {
      console.log('ROOM ROSTER EMPTY');
    }
    let log;
    for (const [role, roster] of roomRoster.entries()) {
      log = role + ': ';
      for (const name of roster.values()) {
        log += name + ', ';
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
