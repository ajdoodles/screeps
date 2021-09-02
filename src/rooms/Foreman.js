module.exports = (function () {
  var BuildTypes = require("../constants/BuildTypes");
  var ConstructionQueues = require("../heap/ConstructionQueues");
  var MineSurveyor = require("../surveyors/mines");
  var RoadSurveyor = require("../surveyors/roads");

  var mSurveyors = Object.create(null);
  mSurveyors[BuildTypes.MINES] = MineSurveyor;
  mSurveyors[BuildTypes.ROADS] = RoadSurveyor;

  var survey = function (room) {
    for (var surveyor of Object.values(mSurveyors)) {
      surveyor.survey(room);
    }
  };

  var _removeCompletedPlans = function (room, buildType) {
    if (!ConstructionQueues.hasPlannedConstruction(room, buildType)) {
      return;
    }

    var plans = ConstructionQueues.getPlannedConstruction(room, buildType);
    Object.entries(plans).forEach(([structType, positions]) => {
      positions.filter((position) => {
        var sites = position.lookFor(LOOK_CONSTRUCTION_SITES);
        return sites.some(
          (site) => site.my && site.structureType === structType
        );
      });
      if (positions.length === 0) {
        delete plans[structType];
      }
    });
  };

  var _plan = function (room, buildType) {
    if (ConstructionQueues.isEmpty(room, buildType)) {
      return;
    }

    var nextProject = ConstructionQueues.dequeue(room, buildType);
    mSurveyors[buildType].planConstruction(room, nextProject);
  };

  var _build = function (room, buildType) {
    if (!ConstructionQueues.hasPlannedConstruction(room, buildType)) {
      return;
    }

    var plans = ConstructionQueues.getPlannedConstruction(room, buildType);
    Object.entries(plans).forEach(([structType, positions]) => {
      positions.forEach((position) => {
        Object.setPrototypeOf(position, Object.create(RoomPosition.prototype));
        position.createConstructionSite(structType);
      });
    });
  };

  var run = function (room) {
    let buildType = BuildTypes.ROADS;

    _removeCompletedPlans(room, buildType);
    if (!ConstructionQueues.hasPlannedConstruction(room, buildType)) {
      _plan(room, buildType);
      _build(room, buildType);
    }
  };

  var mPublic = {
    survey: survey,
    run: run,
  };

  return mPublic;
})();
