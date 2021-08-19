var recruiter = (function() {

  var mRoleTable = require('tables/RoleTable');

  var recruit = function(roomName) {
    var room = Game.rooms[roomName];

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

    var recruitName;
    for (const [roleName, roleClass] of Object.entries(mRoleTable)) {
      recruitName = recruitRole(roomName, roleClass);
    }
    // The last succesful recruit will be spawned
    if (recruitName) {
      console.log('Recruiting ' + recruitName);
      room.registerRecruit(recruitName);
    }
  };

  var recruitRole = function(roomName, role) {
    var room = Game.rooms[roomName];
    var spawn = room.find(FIND_MY_SPAWNS)[0];

    var coworkers = _.filter(Game.creeps, (creep) => creep.memory.role == role.mRole);
    if (role.needsMoreRecruits(roomName, coworkers.length)) {
      var newName = role.mName + Game.time;
      var response = spawn.spawnCreep(role.mBody, newName, {memory: {role: role.mRole}});
      if (response === OK) {
        return newName;
      }
    }
  };

  var mPublic = {
    recruit: recruit,
  };

  return mPublic;
}());

module.exports = recruiter;
