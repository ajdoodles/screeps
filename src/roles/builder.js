var PioneerRole = require('roles/pioneer');
var Utils = require('utils');

const MAX_BUILDERS = 4;

function BuilderRole() {
  PioneerRole.call(this, 'Builder', 'builder');
};
Utils.inheritFromSuperClass(BuilderRole, PioneerRole);

BuilderRole.prototype.needsMoreRecruits = function (curCount) {
  if (curCount >= MAX_BUILDERS) {
    return false;
  }
  var sites = Game.spawns['Spawn1'].room.find(FIND_MY_CONSTRUCTION_SITES);
  return curCount < sites.length;
}

BuilderRole.prototype._getNextTargetId = function (screep) {
  var targets = screep.room.find(FIND_MY_CONSTRUCTION_SITES, {filter: (site) => site.structureType === STRUCTURE_CONTAINER || site.structureType === STRUCTURE_STORAGE});
  if (targets.length == 0) {
    targets = screep.room.find(FIND_MY_CONSTRUCTION_SITES, {filter: (site) => site.structureType === STRUCTURE_RAMPART || site.structureType === STRUCTURE_WALL});
  }
  if (targets.length == 0) {
      targets = screep.room.find(FIND_MY_CONSTRUCTION_SITES);
  }
  return targets[0].id;
};

BuilderRole.prototype._doWork = function (screep, target) {
  return screep.build(target);
};

BuilderRole.prototype._isWorkDone = function (screep, target) {
  return target === null;
};

module.exports = new BuilderRole();
