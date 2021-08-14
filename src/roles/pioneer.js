var Role = require('roles/role');

function PioneerRole(name, role) {
  Role.call(this, name, role, [WORK, CARRY, MOVE], 0);
};
Role.prototype.inheritRoleMethods(PioneerRole);

PioneerRole.prototype.inheritRoleMethods = function(subRole) {
  //Role.prototype.inheritRoleMethods(subrole);
  subRole.prototype = Object.create(PioneerRole.prototype);
  Object.defineProperty(
    subRole.prototype,
    'constructor',
    {
      value: subRole,
      enumerable: false, // so that it does not appear in 'for in' loop
      writable: true
    }
  );
}

PioneerRole.prototype.init = function(screep) {
  screep.memory.fetching = true;
};

PioneerRole.prototype._getNextTargetId = function (screep) {

};

PioneerRole.prototype.getTarget = function (screep) {
  var targetId = screep.memory.targetId;
  if (!targetId) {
    targetId = this._getNextTargetId(screep);
    if (targetId) {
      screep.memory.targetId = targetId;
      delete screep.memory.bufferId;
      delete screep.memory.sourceId;
    } else {
      return null;
    }
  }
  return Game.getObjectById(targetId);
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
  if (screep.memory.fetching) {
    this.fetchEnergy(screep, target);
  } else if (target) {
    let result = this._doWork(screep, target);
    if (result == ERR_NOT_IN_RANGE) {
      screep.moveTo(target);
    } else {
      if (this._isWorkDone(screep, target)) {
        delete screep.memory.targetId;
      }
    }
  } else {
    // idle
  }
};

module.exports = PioneerRole;
