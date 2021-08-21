module.exports = (function(){

  var Roles = require('constants/Roles');
  var mRecruiter = require('recruiter');
  var mRoomHandlers = Object.create(null);

  // How many pioneers do we need to saturate all of the energy sources in the
  // room.
  var _calculateMaxPioneers = function(room) {
    var pioneerAllowance = 0;
    room.sources.forEach((source) => {
      let sourcePos = source.pos;
      if (source.buffer) {
        sourcePos = source.bufferPos;
      }
      pioneerAllowance += room.getWalkableSurroundings(sourcePos.x, sourcePos.y).length;
    })
    return pioneerAllowance;
  };

  var runDefault = function(room) {
    if (Game.time % 9 === 0) {
      var curPioneers = room.find(FIND_MY_CREEPS, {filter: (creep) => creep.memory.role !== Roles.MINER}).length;
      var maxPioneers = _calculateMaxPioneers(room);
      mRecruiter.recruit(room, [Roles.PIONEER]);
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
