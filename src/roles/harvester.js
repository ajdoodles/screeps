var PioneerRole = require('roles/pioneer');
var Roles = require('../constants/roles');
var Utils = require('utils');

function HarvesterRole() {
  PioneerRole.call(this, Roles.HARVESTER);
};
Utils.inheritFromSuperClass(HarvesterRole, PioneerRole);

HarvesterRole.prototype._getNextTarget = function (screep) {
  var target = screep.pos.findClosestByPath(
    FIND_STRUCTURES,
    {filter: (structure) => (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0});
  return target;
}

HarvesterRole.prototype._doWork = function (screep, target) {
  return screep.transfer(target, RESOURCE_ENERGY);
};

HarvesterRole.prototype._isWorkDone = function (screep, target) {
  return target.store.getFreeCapacity(RESOURCE_ENERGY) === 0;
};

module.exports = new HarvesterRole();
