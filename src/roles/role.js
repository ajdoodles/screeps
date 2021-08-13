function Role(name, role, body, maxCount = 2) {
  this.mName = name;
  this.mRole = role;
  this.mBody = body;
  this.mMaxCount = maxCount;
};

Role.prototype.inheritRoleMethods = function(subRole) {
  subRole.prototype = Object.create(Role.prototype);
  Object.defineProperty(
    subRole.prototype,
    'constructor',
    {
      value: subRole,
      enumerable: false, // so that it does not appear in 'for in' loop
      writable: true
    }
  );
};

Role.prototype.needsMoreRecruits = function(curCount) {
  return curCount < this.mMaxCount;
};

Role.prototype.init = function(screep) {
  screep.memory.fetching = true;
};

Role.prototype._getNextTargetId = function (screep) {
};

Role.prototype.getTarget = function (screep) {
  var targetId = screep.memory.targetId;
  if (!targetId) {
    targetId = this._getNextTargetId(screep);
    if (targetId) {
      screep.memory.targetId = targetId;
      delete screep.memory.bufferId;
      delete screep.memory.sourceId;
    } else {
      return null;
    }
  }
  return Game.getObjectById(targetId);
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

Role.prototype._doWork = function (screep, target) {
};

Role.prototype._isWorkDone = function (screep, target) {

};

Role.prototype.run = function(screep) {
  var canFetchMore = screep.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
  var hasNoEnergy = screep.store.getUsedCapacity(RESOURCE_ENERGY) == 0;
  screep.memory.fetching = (screep.memory.fetching && canFetchMore) || hasNoEnergy;

  var target = this.getTarget(screep);
  if (screep.memory.fetching) {
    this.fetchEnergy(screep, target);
  } else if (target) {
    let result = this._doWork(screep, target);
    if (result == ERR_NOT_IN_RANGE) {
      screep.moveTo(target);
    } else {
      if (this._isWorkDone(screep, target)) {
        delete screep.memory.targetId;
      }
    }
  } else {
    // idle
  }
};

Role.prototype.cleanUp = function(memory) {

};

module.exports = Role;
