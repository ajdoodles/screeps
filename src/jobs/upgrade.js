module.exports = (function () {
  var getNextTarget = function (screep) {
    return screep.room.controller;
  };

  var doWork = function (screep) {
    return screep.upgradeController(screep.room.controller);
  };

  var isWorkDone = function () {
    return false;
  };

  var mPublic = {
    getNextTarget: getNextTarget,
    doWork: doWork,
    isWorkDone: isWorkDone,
  };

  return mPublic;
})();
