module.exports = (function () {
  var getBodyCost = function (body) {
    return body.reduce(
      (totalCost, bodyPart) => totalCost + BODYPART_COST[bodyPart],
      0
    );
  };

  var mPublic = {
    getBodyCost: getBodyCost,
  };

  return mPublic;
})();
