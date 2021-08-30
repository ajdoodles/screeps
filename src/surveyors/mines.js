var Surveyor = require('surveyors/surveyor');
var Utils = require('utils');

var mConstructionQueues = require('../heap/ConstructionQueues');

function MineSurveyor() {
  Surveyor.call(this);
};
Utils.inheritFromSuperClass(MineSurveyor, Surveyor);

MineSurveyor.prototype.survey = function (room) {
  if (!mConstructionQueues.isEmpty(BuildTypes.MINES)) {
    return;
  }

  var sourcesWithoutBuffers = room.sources.filter((source) => !source.buffer);

  if (sourcesWithoutBuffers.length === 0) {
    return;
  }

  var sourceDistances = Object.create(null);
  sourcesWithoutBuffers.forEach((source) => {
    var results = PathFinder.search(
      room.mainSpawn.pos,
      {pos: source.pos, range: 1},
      {swampCost: 1});
    sourceDistances[source.id] = results.path.length;
  }).sort((firstSource, secondSource) => {
    sourceDistances[firstSource.id] - sourceDistances[secondSource.id];
  }).forEach((source) => mConstructionQueues.queue(BuildTypes.MINES, source));
};

MineSurveyor.prototype.planConstruction = function(source) {
  var {x, y} = source.bufferPos;
  room.createConstructionSite(x, y, STRUCTURE_CONTAINER);
};

module.exports = new MineSurveyor();
