var BuildTypes = require('../constants/BuildTypes');
var Classes = require('../utils/Classes');
var ConstructionQueues = require('../heap/ConstructionQueues');
var Surveyor = require('../surveyors/surveyor');

function MineSurveyor() {
  Surveyor.call(this);
};
Classes.inheritFromSuperClass(MineSurveyor, Surveyor);

MineSurveyor.prototype.survey = function (room) {
  if (!ConstructionQueues.isEmpty(room, BuildTypes.MINES)) {
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
  });
  sourcesWithoutBuffers.sort((firstSource, secondSource) => {
    sourceDistances[firstSource.id] - sourceDistances[secondSource.id];
  }).forEach((source) => {
    ConstructionQueues.enqueue(room, BuildTypes.MINES, source);
  });
};

MineSurveyor.prototype.planConstruction = function(room, source) {
  var {x, y} = source.bufferPos;
  room.createConstructionSite(x, y, STRUCTURE_CONTAINER);
};

module.exports = new MineSurveyor();
