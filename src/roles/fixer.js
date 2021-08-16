var PioneerRole = require('roles/pioneer');
var Roles = require('../constants/roles');
var Utils = require('utils');

const MAX_FIXERS = 2;

function FixerRole() {
  PioneerRole.call(this, 'Fixer', Roles.FIXER);
};
Utils.inheritFromSuperClass(FixerRole, PioneerRole);

FixerRole.prototype.needsMoreRecruits = function (curCount) {
  return curCount < MAX_FIXERS;
}

FixerRole.prototype._getNextTarget = function (screep) {
  var targets = screep.room.find(FIND_STRUCTURES, {filter: (site) => site.hits < site.hitsMax});
  var target = null;
  if (targets.length > 0) {
    targets.reduce((mostDamaged, candidate) => candidate.hits < mostDamaged.hits ? candidate : mostDamaged);
  }
  return target;
};

FixerRole.prototype._doWork = function (screep, target) {
  return screep.repair(target);
};

FixerRole.prototype._isWorkDone = function (screep, target) {
  return target.hits === target.hitsMax;
};

module.exports = new FixerRole();
