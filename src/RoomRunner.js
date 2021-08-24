module.exports = (function(){

  var PioneerRole = require('roles/pioneer');
  var Roles = require('constants/Roles');
  var Utils = require('utils/Utils');

  var mRecruiter = require('recruiter');
  var mTasker = require('tasker/Tasker');

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
    });
    return pioneerAllowance;
  };

  var _runDefault = function(room, hiringTargets) {
    if (Game.time % 9 === 0) {
      let energyGap = room.energyCapacityAvailable - room.energyAvailable;
      let pioneerCost = Utils.getBodyCost(PioneerRole.BASE_BODY);
      // Each pioneer carries 50 energy
      let numHarvesters = Math.ceil(Math.max(energyGap, pioneerCost) / 50);
      let curHarvesters = room.getRoleCount(Roles.HARVESTER);

      numHarvesters -= curHarvesters;
      if (numHarvesters > 0) {
        hiringTargets.set(Roles.HARVESTER, numHarvesters);
      }
    }
  };

  var _meetHiringTargets = function(room, hiringTargets) {
    var recruitRequest = [];
    hiringTargets.forEach((count, role) => {
      let retasked = mTasker.retaskPioneers(room, role, count);
      let needsMore = (count - retasked) > 0;
      if (needsMore) {
        recruitRequest.push(role);
      }
    });
    if (recruitRequest.length > 0) {
      mRecruiter.recruit(room, recruitRequest);
    }
  };

  var run = function(roomName) {
    var room = Game.rooms[roomName];
    var controllerLevel = room.controller.level;
    var hiringTargets = new Map();

    _runDefault(room, hiringTargets);
    _meetHiringTargets(room, hiringTargets);
  };

  var mPublic = {
    run: run
  };

  return mPublic;
})();
