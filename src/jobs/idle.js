module.exports = (function () {
  var getNextTarget = function () {
    return null;
  };

  var doWork = function () {};

  var isWorkDone = function () {
    return true;
  };

  var mPublic = {
    getNextTarget: getNextTarget,
    doWork: doWork,
    isWorkDone: isWorkDone,
  };

  return mPublic;
})();
