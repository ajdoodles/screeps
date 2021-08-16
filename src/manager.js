var manager = (function() {
  var mRoles = [
    'builder',
    'fixer',
    'upgrader',
    'miner',
    'harvester'
  ];

  var mRoleTable = {};

  var buildRoleTable = function() {
    for (var i in mRoles) {
      var role = mRoles[i];
      mRoleTable[role] = require('./roles/' + role);
    }
  };

  buildRoleTable();

  var init = function() {

  };

  var clearMemory = function() {
    for (var name in Memory.creeps) {
      if (!Game.creeps[name]) {
        var role = Memory.creeps[name].role;
        if (role) {
          mRoleTable[role].cleanUp(Memory.creeps[name]);
        }
        delete Memory.creeps[name];
      }
    }
  };

  var recruit = function(spawn) {
    spawn.room.initReadyRecruits((recruitName) => {
      let creep = Game.creeps[recruitName];
      if (creep.ticksToLive <= (CREEP_LIFE_TIME - 1)) {
        // Technically the game 'steals' the first tick for the movement out
        // of the spawn position.
        console.log('WARNING: Initializing [' + recruitName + '] with less ticks to live than max.' + '[' + creep.ticksToLive + '/' + CREEP_LIFE_TIME + ']')
      }
      mRoleTable[creep.memory.role].init(creep);
    });

    var recruitName;
    for (let role in mRoleTable) {
      recruitName = recruitRole(spawn, mRoleTable[role]);
    }
    // The last succesful recruit will be spawned
    if (recruitName) {
      console.log('Recruiting ' + recruitName);
      spawn.room.registerRecruit(recruitName);
    }
  };

  var recruitRole = function(spawn, role) {
    var coworkers = _.filter(Game.creeps, (creep) => creep.memory.role == role.mRole);
    if (role.needsMoreRecruits(coworkers.length)) {
      var newName = role.mName + Game.time;
      var response = spawn.spawnCreep(role.mBody, newName, {memory: {role: role.mRole}});
      if (response === OK) {
        return newName;
      }
    }
  };

  var run = function() {
    for (var creepName in Game.creeps) {
      var screep = Game.creeps[creepName];
      mRoleTable[screep.memory.role].run(screep);
    }
  };

  var mPublic = {
    init: init,
    clearMemory: clearMemory,
    recruit: recruit,
    run: run,
  }

  return mPublic;
}());

module.exports = manager;
