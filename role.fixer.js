var Role = require('role');

function FixerRole() {
  Role.call(this, 'Fixer', 'fixer', [WORK, CARRY, MOVE], 2);
};
Role.prototype.inheritRoleMethods(FixerRole);

FixerRole.prototype.run = function(screep) {
  if(screep.memory.building && screep.store[RESOURCE_ENERGY] == 0) {
    screep.memory.building = false;
    screep.say('🔄 harvest');
  }
  if(!screep.memory.building && screep.store.getFreeCapacity() == 0) {
    screep.memory.building = true;
    screep.say('fix');
  }

  var targets = screep.room.find(FIND_STRUCTURES, {filter: (site) => site.hits < site.hitsMax});

  if (targets.length > 0) {
    var target = targets.reduce(
      (mostDamaged, candidate, curIndex) => candidate.hits < mostDamaged.hits ? candidate : mostDamaged);
    if (screep.memory.building) {
      if (target) {
        if (screep.repair(target) == ERR_NOT_IN_RANGE) {
          screep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
      }
    } else {
      this.fetchEnergy(screep, target);
    }
  }
};

module.exports = new FixerRole();
