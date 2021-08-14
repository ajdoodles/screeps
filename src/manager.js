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

  var mRoadSurveyor = require('./surveyors/roads');
  var mMineSurveyor = require('./surveyors/mines');

  var init = function() {
    Object.defineProperty(
      Room.prototype,
      'sources',
      {
        get: function () {
          if (!this._sources) {
            if (!this.memory.sourceIds) {
              this.memory.sourceIds = this.find(FIND_SOURCES).map((source) => source.id);
            }
            this._sources = this.memory.sourceIds.map((id) => Game.getObjectById(id));
          }
          return this._sources;
        },
        enumerable: false,
        configurable: true
      });

      Memory.sourceBufferId = {};
      Object.defineProperty(
        Source.prototype,
        'buffer',
        {
          get: function () {
            if (!this._buffer) {

              if (!Memory.sourceBufferId[this.id]) {
                var buffer = this.pos.findInRange(
                  FIND_STRUCTURES,
                  1,
                  {filter: (struct) => struct.structureType === STRUCTURE_CONTAINER || struct.structureType === STRUCTURE_STORAGE}
                )[0];
                if (buffer) {
                  Memory.sourceBufferId[this.id] = buffer.id;
                } else {
                  delete Memory.sourceBufferId[this.id];
                }
              }
              this._buffer = Game.getObjectById(Memory.sourceBufferId[this.id]);
            }
            return this._buffer;
          },
          enumerable: false,
          configurable: true
        });

    var roomName = Game.spawns['Spawn1'].room.name;
    mRoadSurveyor.survey(roomName);
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

  var survey = function() {

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
    survey: survey,
    recruit: recruit,
    run: run,
  }

  return mPublic;
}());

module.exports = manager;
