import { BuildType } from "../constants/BuildTypes";
import * as ConstructionQueues from "../heap/ConstructionQueues";
import * as MineSurveyor from "../surveyors/mines";
import * as RoadSurveyor from "../surveyors/roads";

const mSurveyors = Object.freeze({
  [BuildType.MINES]: MineSurveyor,
  [BuildType.ROADS]: RoadSurveyor,
});

export function survey(room: Room) {
  for (var surveyor of Object.values(mSurveyors)) {
    surveyor.survey(room);
  }
}

function removeCompletedPlans(room: Room, buildType: BuildType) {
  if (!ConstructionQueues.hasPlannedConstruction(room, buildType)) {
    return;
  }

  var plans = ConstructionQueues.getPlannedConstruction(room, buildType);
  var structTypes = Object.keys(plans) as BuildableStructureConstant[];
  for (let structType of structTypes) {
    let positions: RoomPosition[] = plans[structType];
    positions.filter((position: RoomPosition) => {
      var sites = position.lookFor(LOOK_CONSTRUCTION_SITES);
      return sites.some(
        (site: ConstructionSite) => site.my && site.structureType === structType
      );
    });
    if (positions.length === 0) {
      delete plans[structType];
    }
  }
}

function plan(room: Room, buildType: BuildType) {
  if (ConstructionQueues.isEmpty(room, buildType)) {
    return;
  }

  var nextProject = ConstructionQueues.dequeue(room, buildType);
  mSurveyors[buildType].planConstruction(room, nextProject);
}

function build(room: Room, buildType: BuildType) {
  if (!ConstructionQueues.hasPlannedConstruction(room, buildType)) {
    return;
  }

  var plans = ConstructionQueues.getPlannedConstruction(room, buildType);
  var structTypes = Object.keys(plans) as BuildableStructureConstant[];
  for (let structType of structTypes) {
    let positions: RoomPosition[] = plans[structType];
    positions.forEach((position) => {
      Object.setPrototypeOf(position, Object.create(RoomPosition.prototype));
      position.createConstructionSite(structType);
    });
  }
}

export function run(room: Room) {
  let buildType = BuildType.ROADS;

  removeCompletedPlans(room, buildType);
  if (!ConstructionQueues.hasPlannedConstruction(room, buildType)) {
    plan(room, buildType);
    build(room, buildType);
  }
}
