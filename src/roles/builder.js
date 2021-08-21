var PioneerRole = require('roles/pioneer');
var Roles = require('../constants/roles');
var Classes = require('../utils/Classes');

function BuilderRole() {
  PioneerRole.call(this, Roles.BUILDER);
};
Classes.inheritFromSuperClass(BuilderRole, PioneerRole);

BuilderRole.prototype._getNextTarget = function (screep) {
  var sites = screep.room.find(FIND_MY_CONSTRUCTION_SITES);
  if (sites.length == 0) {
    return null;
  }

  var targets = sites.filter((site) => site.structureType === STRUCTURE_CONTAINER || site.structureType === STRUCTURE_STORAGE);
  if (targets.length == 0) {
    targets = sites.filter((site) => site.structureType === STRUCTURE_RAMPART || site.structureType === STRUCTURE_WALL);
  }
  if (targets.length == 0) {
    targets = sites;
  }
  return targets[0];
};

BuilderRole.prototype._doWork = function (screep, target) {
  return screep.build(target);
};

BuilderRole.prototype._isWorkDone = function (screep, target) {
  return target === null;
};

module.exports = new BuilderRole();
