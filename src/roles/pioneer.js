var Constants = require("../constants/Constants");
var Jobs = require("../constants/Jobs");
var JobsTable = require("../tables/JobsTable").default;
var Role = require("./role");
var RoomRosters = require("../heap/RoomRosters");
var Utils = require("../utils/Utils");
var Classes = require("../utils/Classes");

function PioneerRole() {
  Role.call(this, Constants.PIONEER_NAME, Constants.PIONEER_BODY);
}
Classes.inheritFromSuperClass(PioneerRole, Role);

PioneerRole.prototype.getBodyCost = function () {
  return Utils.getBodyCost(this.mBody);
};

PioneerRole.prototype.reassignRole = function (screep, newRole) {
  if (screep.memory.role === newRole) {
    return;
  }
  RoomRosters.removeCreepNameFromRoster(screep.room, screep.name);
  screep.memory.role = newRole;
  RoomRosters.addCreepNameToRoster(screep.room, screep.name);
  this._setTarget(screep, null);
};

PioneerRole.prototype.init = function (screep) {
  Role.prototype.init.call(this, screep);
  screep.memory.fetching = true;
};

PioneerRole.prototype._setTarget = function (screep, target) {
  if (target) {
    screep.memory.targetId = target.id;
  } else {
    delete screep.memory.targetId;
  }
  delete screep.memory.bufferId;
  delete screep.memory.sourceId;
};

PioneerRole.prototype.getTarget = function (creep) {
  return Game.getObjectById(creep.memory.targetId);
};

PioneerRole.prototype.run = function (screep) {
  var target = this.getTarget(screep);
  var job = JobsTable[screep.memory.role];

  if (!target) {
    target = job.getNextTarget(screep);
    this._setTarget(screep, target);
  }

  var canFetchMore = screep.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
  var hasNoEnergy = screep.store.getUsedCapacity(RESOURCE_ENERGY) == 0;
  screep.memory.fetching =
    ((!target || screep.memory.fetching) && canFetchMore) || hasNoEnergy;

  if (screep.memory.fetching) {
    // first fill up on energy
    this.fetchEnergy(screep, target);
  } else if (target) {
    // we have a target
    let result = job.doWork(screep, target); // try to work on it
    if (result == ERR_NOT_IN_RANGE) {
      screep.moveTo(target); // we couldn't work on it, walk towards it
    }

    if (job.isWorkDone(screep, target)) {
      this._setTarget(screep, null);
    }
  } else {
    this.reassignRole(screep, Jobs.IDLE);
  }
};

PioneerRole.prototype.cleanUp = function (name, memory) {
  Role.prototype.cleanUp(name, memory);
};

module.exports = new PioneerRole();
