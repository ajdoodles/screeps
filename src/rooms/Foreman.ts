import { BuildType } from "../constants/BuildTypes";
import * as ConstructionQueues from "../heap/ConstructionQueues";
import { Surveyor } from "../surveyors/surveyor";
import { MineSurveyor } from "../surveyors/mines";
import { RoadSurveyor } from "../surveyors/roads";

const mSurveyors = {
  [BuildType.MINES]: new MineSurveyor(),
  [BuildType.ROADS]: new RoadSurveyor(),
} as const;

export function survey(room: Room): void {
  for (const surveyor of Object.values(mSurveyors)) {
    surveyor.survey(room);
  }
}

function removeCompletedPlans(room: Room, buildType: BuildType) {
  if (!ConstructionQueues.hasPlannedConstruction(room, buildType)) {
    return;
  }

  const plans = ConstructionQueues.getPlannedConstruction(room, buildType);
  const structTypes = Object.keys(plans) as BuildableStructureConstant[];
  for (const structType of structTypes) {
    const positions: RoomPosition[] = plans[structType];
    positions.filter((position: RoomPosition) => {
      const sites = position.lookFor(LOOK_CONSTRUCTION_SITES);
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

  const nextProject = ConstructionQueues.dequeue(room, buildType);
  if (nextProject) {
    const surveyor = mSurveyors[buildType] as Surveyor<typeof buildType>;
    surveyor.planConstruction(room, nextProject);
  }
}

function build(room: Room, buildType: BuildType) {
  if (!ConstructionQueues.hasPlannedConstruction(room, buildType)) {
    return;
  }

  const plans = ConstructionQueues.getPlannedConstruction(room, buildType);
  const structTypes = Object.keys(plans) as BuildableStructureConstant[];
  for (const structType of structTypes) {
    const positions: RoomPosition[] = plans[structType];
    positions.forEach((position) => {
      Object.setPrototypeOf(position, Object.create(RoomPosition.prototype));
      position.createConstructionSite(structType);
    });
  }
}

export function run(room: Room): void {
  const buildType = BuildType.ROADS;

  removeCompletedPlans(room, buildType);
  if (!ConstructionQueues.hasPlannedConstruction(room, buildType)) {
    plan(room, buildType);
    build(room, buildType);
  }
}
