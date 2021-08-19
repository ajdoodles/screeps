module.exports = (function(){

  var mRecruiter = require('recruiter');
  var mRoomHandlers = Object.create(null);

  var runDefault = function(room) {
      mRecruiter.recruit(room);
  };

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
