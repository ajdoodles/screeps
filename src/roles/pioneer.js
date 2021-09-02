var Role = require("roles/role");
var Roles = require("constants/Roles");
var RoomRosters = require("../heap/RoomRosters");
var Classes = require("../utils/Classes");

const BASE_NAME = "Pioneer";
PioneerRole.BASE_BODY = [WORK, CARRY, MOVE];

function PioneerRole(role = Roles.PIONEER) {
  Role.call(this, BASE_NAME, role, PioneerRole.BASE_BODY);
}
Classes.inheritFromSuperClass(PioneerRole, Role);

PioneerRole.prototype.reassignRole = function (screep, newRole) {
  if (screep.memory.role === newRole) {
    return;
  }
  RoomRosters.removeCreepNameFromRoster(screep.room, screep.name);
  var oldRole = screep.memory.role;
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

PioneerRole.prototype._getNextTarget = function (screep) {
  return null;
};

PioneerRole.prototype.getTarget = function (creep) {
  return Game.getObjectById(creep.memory.targetId);
};

PioneerRole.prototype._doWork = function (screep, target) {};

PioneerRole.prototype._isWorkDone = function (screep, target) {};

PioneerRole.prototype.run = function (screep) {
  var target = this.getTarget(screep);

  if (!target) {
    target = this._getNextTarget(screep);
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
    let result = this._doWork(screep, target); // try to work on it
    if (result == ERR_NOT_IN_RANGE) {
      screep.moveTo(target); // we couldn't work on it, walk towards it
    }

    if (this._isWorkDone(screep, target)) {
      this._setTarget(screep, null);
    }
  } else {
    this.reassignRole(screep, Roles.PIONEER);
  }
};

PioneerRole.prototype.cleanUp = function (name, memory) {
  Role.prototype.cleanUp(name, memory);
};

module.exports = PioneerRole;
