var Surveyor = require('surveyors/surveyor');
var Utils = require('utils');

function MineSurveyor() {
  Surveyor.call(this);
};
Utils.inheritFromSuperClass(MineSurveyor, Surveyor);

MineSurveyor.prototype.survey = function (roomName) {
  const room = Game.rooms[roomName];

  var sourcesWithoutBuffers = room.sources.filter((source) => !source.buffer);
  if (sourcesWithoutBuffers.length > 0) {
    var bufferPosList = sourcesWithoutBuffers.map((source) => source.bufferPos);
    bufferPosList.forEach((pos) => Object.setPrototypeOf(pos, Object.create(RoomPosition.prototype)));
    var results = PathFinder.search(room.mainSpawn.pos, bufferPosList);
    var newBufferPos = results.path[results.path.length - 1];
    room.createConstructionSite(newBufferPos.x, newBufferPos.y, STRUCTURE_CONTAINER);
  }
};

module.exports = new MineSurveyor();
