var Role = require('roles/role');
var Roles = require('../constants/roles');
var Classes = require('../utils/Classes');

function MinerRole(){
  Role.call(this, 'Miner', Roles.MINER, [MOVE, WORK, WORK, WORK, WORK, WORK]);
};

var mSourceMinerIds = {};

var buildMinerList = function() {
  for (var name in Game.creeps) {
    if (Memory.creeps[name].role === 'miner') {
      mSourceMinerIds[Memory.creeps[name].sourceId] = name;
    }
  }
}

buildMinerList();

MinerRole.prototype.init = function(screep) {
  var sources = screep.room.sources;
  for (var i in sources) {
    if (!mSourceMinerIds[sources[i].id]) {
      mSourceMinerIds[sources[i].id] = screep.name;
      screep.memory.sourceId = sources[i].id;
      return;
    }
Classes.inheritFromSuperClass(MinerRole, Role);
  }
};

MinerRole.prototype.run = function(screep) {
  var source = Game.getObjectById(screep.memory.sourceId);

  if (source) {
    if (source.buffer && screep.pos.isEqualTo(source.buffer.pos)) {
      screep.harvest(source);
    } else {
      screep.moveTo(source.buffer);
    }
  }
};

MinerRole.prototype.cleanUp = function(memory) {
  delete mSourceMinerIds[memory.sourceId];
};

module.exports = new MinerRole();
