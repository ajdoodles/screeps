var recruiter = (function() {

  var mRoleTable = require('tables/RoleTable');

  var _initSpawnedRecruits = function(room) {
    while (room.recruits.length > 0 && !Game.creeps[room.recruits[0]].spawning) {
      let recruitName = room.dequeueRecruit();
      let creep = Game.creeps[recruitName];
      if (creep.ticksToLive <= (CREEP_LIFE_TIME - 1)) {
        // Technically the game 'steals' the first tick for the movement out
        // of the spawn position.
        console.log('WARNING: Initializing [' + recruitName + '] with less ticks to live than max.' + '[' + creep.ticksToLive + '/' + CREEP_LIFE_TIME + ']')
      }
      mRoleTable[creep.memory.role].init(creep);
    }
  };

  var _recruitRole = function(room, role) {
    var spawn = room.mainSpawn;
    var roleClass = mRoleTable[role];

    var coworkers = _.filter(Game.creeps, (creep) => creep.memory.role == roleClass.mRole);
    if (roleClass.needsMoreRecruits(room.name, coworkers.length)) {
      var newName = roleClass.mName + Game.time;
      var response = spawn.spawnCreep(roleClass.mBody, newName, {memory: {role: roleClass.mRole}});
      if (response === OK) {
        return newName;
      }
    }
  };

  var recruit = function(room, recruitOrder) {
    _initSpawnedRecruits(room);

    var recruitName;

    recruitOrder.reduce((recruitName, nextRole) => {
      return recruitName ? recruitName : _recruitRole(room, nextRole);
    }, null);

    if (recruitName) {
      room.registerRecruit(recruitName);
    }
  };

  var mPublic = {
    recruit: recruit,
  };

  return mPublic;
}());

module.exports = recruiter;
