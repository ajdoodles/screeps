var recruiter = (function() {

  var mRoleTable = require('tables/RoleTable');

  var _initSpawnedRecruits = function(room) {
    while (room.recruits.length > 0 && !Game.creeps[room.recruits[0]].spawning) {
      let recruitName = room.dequeueRecruit();
      let creep = Game.creeps[recruitName];
      if (creep.ticksToLive <= (CREEP_LIFE_TIME - 1)) {
        // Technically the game 'steals' the first tick for the movement out
        // of the spawn position.
        console.log('WARNING: Initializing [' + recruitName + '] with less ticks to live than max.' + '[' + creep.ticksToLive + '/' + CREEP_LIFE_TIME + ']');
      }
      mRoleTable[creep.memory.role].init(creep);
    }
  };

  var _getRoleCount = function(room, role) {
    if (!room.roleCounts[role]) {
      room.roleCounts[role] = room.find(
        FIND_MY_CREEPS,
        {filter: (creep) => creep.memory.role === role}
      );
    }

    return room.roleCounts[role];
  };

  var _recruitRole = function(room, role) {
    var spawn = room.mainSpawn;
    var roleClass = mRoleTable[role];

    var name = null
    if (roleClass.needsMoreRecruits(room.name, _getRoleCount(room, role))) {
      let newName = roleClass.mName + Game.time;
      let response = spawn.spawnCreep(
        roleClass.mBody,
        newName,
        {memory: {role: roleClass.mRole}}
      );

      if (response === OK) {
        name = newName;
      }
    }

    return name;
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
