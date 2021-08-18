var Surveyor = require('surveyors/surveyor');
var Utils = require('utils');

function MineSurveyor() {
  Surveyor.call(this);
};
Utils.inheritFromSuperClass(MineSurveyor, Surveyor);

MineSurveyor.prototype.survey = function (roomName) {
  const room = Game.rooms[roomName];
  room.sources.forEach((source) => {
    let buffer = source.buffer;
    if (!buffer) {
      let bufferPos = source.bufferPos;
      room.createConstructionSite(bufferPos.x, bufferPos.y, STRUCTURE_CONTAINER);
    }
  });
};

module.exports = new MineSurveyor();
