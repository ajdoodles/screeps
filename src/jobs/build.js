module.exports = (function () {
  var getNextTarget = function (screep) {
    var sites = screep.room.find(FIND_MY_CONSTRUCTION_SITES);
    if (sites.length == 0) {
      return null;
    }

    var targets = sites.filter(
      (site) =>
        site.structureType === STRUCTURE_CONTAINER ||
        site.structureType === STRUCTURE_STORAGE
    );
    if (targets.length == 0) {
      targets = sites.filter(
        (site) =>
          site.structureType === STRUCTURE_RAMPART ||
          site.structureType === STRUCTURE_WALL
      );
    }
    if (targets.length == 0) {
      targets = sites;
    }
    return targets[0];
  };

  var doWork = function (screep, target) {
    return screep.build(target);
  };

  var isWorkDone = function (screep, target) {
    return target === null;
  };

  var mPublic = {
    getNextTarget: getNextTarget,
    doWork: doWork,
    isWorkDone: isWorkDone,
  };

  return mPublic;
})();
