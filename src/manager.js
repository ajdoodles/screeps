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

  var recruit = function() {
    for (var role in mRoleTable) {
      recruitRole(mRoleTable[role]);
    }
  };

  var recruitRole = function(role) {
    var homeSpawn = Game.spawns['Spawn1'];

    var coworkers = _.filter(Game.creeps, (creep) => creep.memory.role == role.mRole);
    if (role.needsMoreRecruits(coworkers.length)) {
      var newName = role.mName + Game.time;
      var response = homeSpawn.spawnCreep(role.mBody, newName, {memory: {role: role.mRole}});
      if (response === OK) {
        role.init(Game.creeps[newName]);
        console.log('Recruiting new ' + role.mRole + ' named ' + newName + '. Count: ' + (coworkers.length + 1) + ', Max: ' + role.mMaxCount);
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
