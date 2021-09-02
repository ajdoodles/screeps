var PioneerRole = require("roles/pioneer");
var Roles = require("../constants/Roles");
var Classes = require("../utils/Classes");

function FixerRole() {
  PioneerRole.call(this, Roles.FIXER);
}
Classes.inheritFromSuperClass(FixerRole, PioneerRole);

FixerRole.prototype._getNextTarget = function (screep) {
  var targets = screep.room.find(FIND_STRUCTURES, {
    filter: (site) => site.hits < site.hitsMax,
  });
  var target = null;
  if (targets.length > 0) {
    targets.reduce((mostDamaged, candidate) =>
      candidate.hits < mostDamaged.hits ? candidate : mostDamaged
    );
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
