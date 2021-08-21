module.exports = (function(){

  var Roles = require('constants/Roles');
  var mRecruiter = require('recruiter');
  var mRoomHandlers = Object.create(null);

  // How many harvesters do we need to saturate all of the energy sources in the
  // room.
  var _calculateMaxHarvesters = function(room) {
    var harvesterAllowance = 0;
    room.sources.forEach((source) => {
      let sourcePos = source.pos;
      if (source.buffer) {
        sourcePos = source.bufferPos;
      }
      harvesterAllowance += room.getWalkableSurroundings(sourcePos.x, sourcePos.y).length;
    })
    return harvesterAllowance;
  };

  var runDefault = function(room) {
    if (Game.time % 9 === 0) {
      var curHarvesters = mRecruiter.getRoleCount(room, Roles.HARVESTER);
      var maxHarvesters = _calculateMaxHarvesters(room);
      mRecruiter.recruit(room, [Roles.HARVESTER]);
    }
  };

  mRoomHandlers[0] = function(room) {
  var run = function(roomName) {
    var room = Game.rooms[roomName];
    var controllerLevel = room.controller.level;
    if (!mRoomHandlers[controllerLevel]) {
      runDefault(room);
    } else {
      mRoomHandlers[controllerLevel](room);
    }
  };

  var mPublic = {
    run: run
  };

  return mPublic;
})();
