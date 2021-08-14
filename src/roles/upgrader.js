var Role = require('roles/role');
var Utils = require('utils');

function UpgraderRole() {
  Role.call(this, 'Upgrader', 'upgrader', [WORK, CARRY, MOVE]);
};
Utils.inheritFromSuperClass(UpgraderRole, Role);

/** @param {Creep} screep **/
UpgraderRole.prototype.run = function(screep) {

  if(screep.memory.upgrading && screep.store[RESOURCE_ENERGY] == 0) {
    screep.memory.upgrading = false;
    screep.say('🔄 harvest');
  }
  if(!screep.memory.upgrading && screep.store.getFreeCapacity() == 0) {
    screep.memory.upgrading = true;
    screep.say('⚡ upgrade');
  }

  if(screep.memory.upgrading) {
    if(screep.upgradeController(screep.room.controller) == ERR_NOT_IN_RANGE) {
      screep.moveTo(screep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
    }
  }
  else {
    this.fetchEnergy(screep, screep.room.controller);
  }
};

module.exports = new UpgraderRole();
