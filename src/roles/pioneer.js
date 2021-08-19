var Role = require('roles/role');
var Roles = require('constants/roles');
var Utils = require('utils');

const BASE_NAME = 'Pioneer';

function PioneerRole(role = Roles.PIONEER) {
  Role.call(this, BASE_NAME, role, [WORK, CARRY, MOVE]);
};
Utils.inheritFromSuperClass(PioneerRole, Role);

PioneerRole.prototype.reassignRole = function (screep, newRole) {
  var oldRole = screep.memory.role;
  screep.memory.role = newRole;
  this._setTarget(screep, null);
};

PioneerRole.prototype.init = function(screep) {
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

PioneerRole.prototype.getTarget = function (screep) {
  var target = Game.getObjectById(screep.memory.targetId);
  if (!target) {
    this._setTarget(screep, this._getNextTarget(screep));
  }
  return Game.getObjectById(screep.memory.targetId);
};

PioneerRole.prototype._doWork = function (screep, target) {
};

PioneerRole.prototype._isWorkDone = function (screep, target) {

};

PioneerRole.prototype.run = function(screep) {
  var target = this.getTarget(screep);

  var canFetchMore = screep.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
  var hasNoEnergy = screep.store.getUsedCapacity(RESOURCE_ENERGY) == 0;
  screep.memory.fetching = ((!target || screep.memory.fetching) && canFetchMore) || hasNoEnergy;

  if (screep.memory.fetching) { // first fill up on energy
    this.fetchEnergy(screep, target);
  } else if (target) { // we have a target
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

PioneerRole.prototype.cleanUp = function(memory) {

};

module.exports = PioneerRole;
