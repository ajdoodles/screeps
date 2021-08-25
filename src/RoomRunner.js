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

  var _addToHiringTargets = function(role, count, hiringTargets) {
    if (count <= 0) {
      return;
    }

    if (!hiringTargets.has(role)) {
      hiringTargets.set(role, 0);
    }
    hiringTargets.set(role, hiringTargets.get(role) + count);
  };

  var _matchDemand = function(room, role, count, hiringTargets) {
    if (count <= 0) {
      return;
    }

    var curRoleCount = room.getRoleCount(role);

    if (count <= curRoleCount) {
      return; // We have enough of these, don't hire more
    }

    if (!hiringTargets.has(role)) {
      hiringTargets.set(role, 0);
    }
    hiringTargets.set(role, count - curRoleCount);
  };

  var _runDefault = function(room, hiringTargets) {
    if (Game.time % 9 === 0) {
      let curPioneers = room.getCreepCount();
      let numPioneers = Utils.getBodyCost(PioneerRole.BASE_BODY) / 50;
      numPioneers -= curPioneers;
      _addToHiringTargets(Roles.PIONEER, numPioneers, hiringTargets);

      let energyGap = room.energyCapacityAvailable - room.energyAvailable;
      // Each pioneer carries 50 energy
      let numHarvesters = Math.ceil(energyGap / 50);
      _matchDemand(room, Roles.HARVESTER, numHarvesters, hiringTargets);

      let numUpgraders = room.controller.level + 1;
      _matchDemand(room, Roles.UPGRADER, numUpgraders, hiringTargets);
    }
  };

  var _meetHiringTargets = function(room, hiringTargets) {
    if (hiringTargets.size === 0) {
      return;
    }

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
    run: run,
  };

  return mPublic;
})();
