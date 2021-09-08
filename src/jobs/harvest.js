module.exports = (function () {
  var getNextTarget = function (screep) {
    var target = screep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure) =>
        (structure.structureType == STRUCTURE_SPAWN ||
          structure.structureType == STRUCTURE_EXTENSION) &&
        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
    });
    return target;
  };

  var doWork = function (screep, target) {
    return screep.transfer(target, RESOURCE_ENERGY);
  };

  var isWorkDone = function (screep, target) {
    return target.store.getFreeCapacity(RESOURCE_ENERGY) === 0;
  };

  var mPublic = {
    getNextTarget: getNextTarget,
    doWork: doWork,
    isWorkDone: isWorkDone,
  };

  return mPublic;
})();
