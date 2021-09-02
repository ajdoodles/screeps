module.exports = (function(){

  var Foreman = require('./Foreman');
  var PioneerRole = require('../roles/pioneer');
  var Recruiter = require('./Recruiter');
  var Roles = require('../constants/Roles');
  var RoomRosters = require('../heap/RoomRosters');
  var Tasker = require('./Tasker');
  var Utils = require('../utils/Utils');

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

    var curRoleCount = RoomRosters.getRoleCount(room, role);

    if (count <= curRoleCount) {
      return; // We have enough of these, don't hire more
    }

    if (!hiringTargets.has(role)) {
      hiringTargets.set(role, 0);
    }
    hiringTargets.set(role, count - curRoleCount);
  };

  var _requestHarvesters = function(room, hiringTargets) {
    let pioneerCost = Utils.getBodyCost(PioneerRole.BASE_BODY);
    let energyGap = room.energyCapacityAvailable - room.energyAvailable;
    let energyNeeds = Math.max(energyGap, pioneerCost);
    // Each pioneer carries 50 energy
    let numHarvesters = Math.ceil(energyNeeds / 50);
    _matchDemand(room, Roles.HARVESTER, numHarvesters, hiringTargets);
  };

  var _requestBuilders = function(room, hiringTargets) {
    var sites = room.find(FIND_MY_CONSTRUCTION_SITES);
    var numBuilders = sites.length === 0 ? 0 : 4;
    _matchDemand(room, Roles.BUILDER, numBuilders, hiringTargets);
  };

  var _requestUpgraders = function(room, hiringTargets) {
    let numUpgraders = room.controller.level + 1;
    _matchDemand(room, Roles.UPGRADER, numUpgraders, hiringTargets);
  };

  var _meetHiringTargets = function(room, hiringTargets) {
    if (hiringTargets.size === 0) {
      return;
    }

    var recruitRequest = [];
    hiringTargets.forEach((count, role) => {
      let retasked = Tasker.retaskPioneers(room, role, count);
      let needsMore = (count - retasked) > 0;
      if (needsMore) {
        recruitRequest.push(role);
      }
    });
    if (recruitRequest.length > 0) {
      Recruiter.recruit(room, recruitRequest);
    }
  };

  var init = function(roomName) {
    var room = Game.rooms[roomName];

    Foreman.survey(room);
  };

  var run = function(roomName) {
    var room = Game.rooms[roomName];

    Recruiter.initSpawnedRecruits(room);

    if (Game.time % 25 === 0) {
      Foreman.run(room);
    }

    var hiringTargets = new Map();
    if (Game.time % 9 === 0) {
      _requestHarvesters(room, hiringTargets);
      _requestUpgraders(room, hiringTargets);
      _requestBuilders(room, hiringTargets);
      _meetHiringTargets(room, hiringTargets);
    }
  };

  var mPublic = {
    run: run,
    init: init,
  };

  return mPublic;
})();
