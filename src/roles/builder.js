var Role = require('roles/role');
var Utils = require('utils');

function BuilderRole() {
  Role.call(this, 'Builder', 'builder', [WORK, CARRY, MOVE]);
};
Utils.inheritFromSuperClass(BuilderRole, Role);

BuilderRole.prototype.needsMoreRecruits = function (curCount) {
  var sites = Game.spawns['Spawn1'].room.find(FIND_MY_CONSTRUCTION_SITES);
  return curCount < sites.length;
}

BuilderRole.prototype.run = function(screep) {
  if(screep.memory.building && screep.store[RESOURCE_ENERGY] == 0) {
        screep.memory.building = false;
        screep.say('🔄 harvest');
  }
  if(!screep.memory.building && screep.store.getFreeCapacity() == 0) {
      screep.memory.building = true;
      screep.say('🚧 build');
  }

    var targets = screep.room.find(FIND_MY_CONSTRUCTION_SITES, {filter: (site) => site.structureType == STRUCTURE_RAMPART || site.structureType == STRUCTURE_WALL});
    if (targets.length == 0) {
        targets = screep.room.find(FIND_MY_CONSTRUCTION_SITES);
    }
  if (screep.memory.building) {
        if (targets.length) {
            if (screep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                screep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
  } else {
      this.fetchEnergy(screep, targets[0]);
  }
};

module.exports = new BuilderRole();
