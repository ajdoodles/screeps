module.exports = (function(){

  var mRecruiter = require('recruiter');
  var mRoleTable = require('tables/RoleTable');

  var garbageCollect = function() {
    for (var name in Memory.creeps) {
      if (!Game.creeps[name]) {
        mRoleTable[Memory.creeps[name].role].cleanUp(Memory.creeps[name]);
        delete Memory.creeps[name];
      }
    }
  };

  var runRooms = function () {
    var rootRoomName = Game.spawns['Spawn1'].room.name;
    mRecruiter.recruit(rootRoomName);
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
