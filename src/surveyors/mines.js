var BuildTypes = require("../constants/BuildTypes");
var ConstructionQueues = require("../heap/ConstructionQueues");

function MineSurveyor() {}

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
      { pos: source.pos, range: 1 },
      { swampCost: 1 }
    );
    sourceDistances[source.id] = results.path.length;
  });
  sourcesWithoutBuffers
    .sort((firstSource, secondSource) => {
      sourceDistances[firstSource.id] - sourceDistances[secondSource.id];
    })
    .forEach((source) => {
      ConstructionQueues.enqueue(room, BuildTypes.MINES, source.id);
    });
};

MineSurveyor.prototype.planConstruction = function (room, sourceId) {
  var site = Object.create(null);
  site[STRUCTURE_CONTAINER] = [Game.getObjectById(sourceId).bufferPos];
  ConstructionQueues.setPlannedConstruction(room, BuildTypes.MINES, site);
};

module.exports = new MineSurveyor();
