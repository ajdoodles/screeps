module.exports = (function(){

  var mRoleTable = require('tables/RoleTable');
  var mRoomRunner = require('RoomRunner');

  var garbageCollect = function() {
    for (const [name, memory] of Object.entries(Memory.creeps)) {
      if (!Game.creeps[name]) {
        mRoleTable[memory.role].cleanUp(name, memory);
        delete Memory.creeps[name];
      }
    }
  };

  var runRooms = function () {
    var rootRoomName = Game.spawns['Spawn1'].room.name;
    mRoomRunner.run(rootRoomName);
  };

  var runCreeps = function() {
    for (var creepName in Game.creeps) {
      var screep = Game.creeps[creepName];
      mRoleTable[screep.memory.role].run(screep);
    }
  };

  var mPublic = {
    garbageCollect: garbageCollect,
    runRooms: runRooms,
    runCreeps: runCreeps,
  };

  return mPublic;
})();
