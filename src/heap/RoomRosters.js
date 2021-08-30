module.exports = (function(){

  var RoomsHeap = require('./RoomsHeap');

  var _addCreepNameToRosters = function(allRosters, creepName) {
    if (!allRosters.has(Memory.creeps[creepName].role)) {
      allRosters.set(Memory.creeps[creepName].role, new Set());
    }
    allRosters.get(Memory.creeps[creepName].role).add(creepName);
  };

  var _removeCreepNameFromRosters = function(allRosters, creepName) {
    var roleRoster = allRosters.get(Memory.creeps[creepName].role);
    roleRoster.delete(creepName);
    if (roleRoster.size === 0) {
      allRosters.delete(Memory.creeps[creepName].role);
    }
  };

  var _getAllRosters = function(room) {
    console.log('_getAllRosters room is ' + room + ', heap is ', room.heap);
    console.log(Object.entries(room.heap));
    if (!room.heap.rosters) {
      let allRosters = new Map();

      room.find(FIND_MY_CREEPS).forEach((creep) => {
        _addCreepNameToRosters(allRosters, creep.name);
      });

      room.heap.rosters = allRosters;
    }
    return room.heap.rosters;
  };

  var _getRoleRoster = function(room, role) {
    var rosters = _getAllRosters(room);
    if (!rosters.has(role)) {
      rosters.set(role, []);
    }
    return rosters.get(role);
  };

  var getRoomRoster = function(room) {
    return new Map(_getAllRosters(room));
  };

  var getRoomRosterForRole = function(room, role) {
    return Array.from(_getRoleRoster(room, role));
  };

  var getRoleCount = function(room, role) {
    return _getRoleRoster(room, role).length;
  };

  var getCreepCount = function(room) {
    var totalCount = 0;
    console.log('getting getCreepCount, room is ' + room);
    _getAllRosters(room).forEach((roster) => totalCount += roster.length);
    return totalCount;
  };

  var addCreepNameToRoster = function(room, creepName) {
    var allRosters = _getAllRosters(room);
    _addCreepNameToRosters(allRosters, creepName);
  };

  var removeCreepNameFromRoster = function(room, creepName) {
    var allRosters = _getAllRosters(room);
    _removeCreepNameFromRosters(allRosters, creepName);
  };

  var logRoomRoster = function(room) {
    var roomRoster = _getAllRosters(room);
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
