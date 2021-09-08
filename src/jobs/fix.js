module.exports = (function () {
  var getNextTarget = function (screep) {
    var targets = screep.room.find(FIND_STRUCTURES, {
      filter: (site) => site.hits < site.hitsMax,
    });
    var target = null;
    if (targets.length > 0) {
      targets.reduce((mostDamaged, candidate) =>
        candidate.hits < mostDamaged.hits ? candidate : mostDamaged
      );
    }
    return target;
  };

  var doWork = function (screep, target) {
    return screep.repair(target);
  };

  var isWorkDone = function (screep, target) {
    return target.hits === target.hitsMax;
  };

  var mPublic = {
    getNextTarget: getNextTarget,
    doWork: doWork,
    isWorkDone: isWorkDone,
  };

  return mPublic;
})();
