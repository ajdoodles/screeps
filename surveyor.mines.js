var Surveyor = require('surveyor');

function MineSurveyor() {
  Surveyor.call(this);
}
Surveyor.prototype.inheritSurveyorMethods(MineSurveyor);

MineSurveyor.prototype.survey = function (roomName) {
  var sources = Game.rooms[roomName].find(FIND_SOURCES);
  for (var i in sources) {

  }

  for (var screepName in Game.creeps) {
    if (Memory.creeps[screepName].role === 'miner') {
      mSourceMinerIds[Memory.creeps[screepName].sourceId] = screepName;
    }
  }
};

module.exports = new MineSurveyor();
