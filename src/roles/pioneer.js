var Role = require('roles/role');
var Utils = require('utils');

function PioneerRole(name, role) {
  Role.call(this, name, role, [WORK, CARRY, MOVE]);
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

PioneerRole.prototype._getNextTargetId = function (screep) {

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
  var canFetchMore = screep.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
  var hasNoEnergy = screep.store.getUsedCapacity(RESOURCE_ENERGY) == 0;
  screep.memory.fetching = (screep.memory.fetching && canFetchMore) || hasNoEnergy;

  var target = this.getTarget(screep);

  if (screep.memory.fetching) { // first fill up on energy
    this.fetchEnergy(screep, target);
  } else if (target){ // we have a target
    let result = this._doWork(screep, target); // try to work on it
    if (result == ERR_NOT_IN_RANGE) {
      screep.moveTo(target); // we couldn't work on it, walk towards it
    }

    if (this._isWorkDone(screep, target)) {
      this._setTarget(screep, null);
    }
  }
};

module.exports = PioneerRole;
