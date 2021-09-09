var Classes = require("../utils/Classes");
var Jobs = require("../constants/Jobs");
var Role = require("./role");

function MinerRole() {
  Role.call(this, "Miner", [MOVE, WORK, WORK, WORK, WORK, WORK]);
}
Classes.inheritFromSuperClass(MinerRole, Role);

MinerRole.prototype.init = function (creep) {
  Role.prototype.init.call(this, creep);
  creep.memory.role = Jobs.MINE;
  var freeSource = creep.room.sources.find((source) => !source.miner);
  if (freeSource) {
    freeSource.miner = creep;
  } else {
    console.log(
      "WARNING: Spawning miner in room " +
        creep.room.name +
        " but there are no free mines."
    );
  }
};

MinerRole.prototype.run = function (screep) {
  var source = Game.getObjectById(screep.memory.sourceId);

  if (source) {
    if (source.buffer && screep.pos.isEqualTo(source.buffer.pos)) {
      screep.harvest(source);
    } else {
      screep.moveTo(source.buffer);
    }
  }
};

MinerRole.prototype.cleanUp = function (name, memory) {
  Role.prototype.cleanUp.call(this, name, memory);
  var source = Game.getObjectById(memory.sourceId);
  if (source) {
    source.miner = null;
  } else {
    console.log(
      "WARNING: Dying miner " + name + " was pointing at corrupted source: ",
      memory.sourceId
    );
  }
};

module.exports = new MinerRole();
