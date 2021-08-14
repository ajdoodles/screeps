var Role = require('roles/role');
var PioneerRole = require('roles/pioneer');

function HarvesterRole() {
  PioneerRole.call(this, 'Harvester', 'harvester');
};
PioneerRole.prototype.inheritRoleMethods(HarvesterRole);

HarvesterRole.prototype._getNextTargetId = function (screep) {
  var target = screep.pos.findClosestByPath(
    FIND_STRUCTURES,
    {filter: (structure) => (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0});
  return target ? target.id : null;
}

HarvesterRole.prototype._doWork = function (screep, target) {
  return screep.transfer(target, RESOURCE_ENERGY);
};

HarvesterRole.prototype._isWorkDone = function (screep, target) {
  return target.store.getFreeCapacity(RESOURCE_ENERGY) === 0;
};

module.exports = new HarvesterRole();
