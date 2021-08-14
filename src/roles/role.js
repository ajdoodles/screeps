function Role(name, role, body, maxCount = 2) {
  this.mName = name;
  this.mRole = role;
  this.mBody = body;
  this.mMaxCount = maxCount;
};

Role.prototype.needsMoreRecruits = function(curCount) {
  return curCount < this.mMaxCount;
};

Role.prototype.init = function(screep) {

};

Role.prototype.fetchEnergy = function(screep, target) {
  var receiver = target;
  if (!receiver) {
    receiver = screep;
  }

  var buffer = Game.getObjectById(screep.memory.bufferId);
  if (!buffer) {
    buffer = receiver.pos.findClosestByPath(FIND_STRUCTURES, {filter: ((struct) => (struct.structureType === STRUCTURE_CONTAINER || struct.structureType === STRUCTURE_STORAGE) && struct.store.getUsedCapacity(RESOURCE_ENERGY) > 50)});
  }

  if (buffer) {
    screep.memory.bufferId = buffer.id;
    if (screep.withdraw(buffer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      screep.moveTo(buffer, {visualizePathStyle: {stroke: '#ffaa00'}});
    }
    return;
  }

  var source = Game.getObjectById(screep.memory.sourceId);
  if (!source) {
    source = receiver.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
  }

  if (source) {
    screep.memory.sourceId = source.id;
    if (screep.harvest(source) == ERR_NOT_IN_RANGE) {
      screep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
    }
  }
};

Role.prototype.run = function(screep) {

};

Role.prototype.cleanUp = function(memory) {

};

module.exports = Role;
