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

  var _recruitRole = function(room, roleClass) {
    var spawn = room.mainSpawn;

    var coworkers = _.filter(Game.creeps, (creep) => creep.memory.role == roleClass.mRole);
    if (roleClass.needsMoreRecruits(room.name, coworkers.length)) {
      var newName = roleClass.mName + Game.time;
      var response = spawn.spawnCreep(roleClass.mBody, newName, {memory: {role: roleClass.mRole}});
      if (response === OK) {
        return newName;
      }
    }
  };

  var recruit = function(roomName) {
    var room = Game.rooms[roomName];

    _initSpawnedRecruits(room);

    var recruitName;
    for (const [role, roleClass] of Object.entries(mRoleTable)) {
      recruitName = _recruitRole(room, roleClass);
    }
    // The last succesful recruit will be spawned
    if (recruitName) {
      console.log('Recruiting ' + recruitName);
      room.registerRecruit(recruitName);
    }
  };

  var mPublic = {
    recruit: recruit,
  };

  return mPublic;
}());

module.exports = recruiter;
