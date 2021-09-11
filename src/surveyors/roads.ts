import BuildTypes from "../constants/BuildTypes";
import * as ConstructionQueues from "../heap/ConstructionQueues";

function queueProjectIfPossible(
  room: Room,
  from: { id: Id<RoomObject> } | undefined | null,
  to?: { id: Id<RoomObject> } | undefined | null
) {
  if (!from) {
    return;
  }

  if (to) {
    ConstructionQueues.enqueue(room, BuildTypes.ROADS, [from.id, to.id]);
  } else {
    ConstructionQueues.enqueue(room, BuildTypes.ROADS, [from.id]);
  }
}

export function survey(room: Room) {
  if (!ConstructionQueues.isEmpty(room, BuildTypes.ROADS)) {
    return;
  }

  var sourceDistances = Object.create(null);
  var sources = Array.from(room.sources);
  sources.forEach((source) => {
    var results = PathFinder.search(
      room.mainSpawn.pos,
      { pos: source.pos, range: 1 },
      { swampCost: 1 }
    );
    sourceDistances[source.id] = results.path.length;
  });
  sources.sort((firstSource, secondSource) => {
    return sourceDistances[firstSource.id] - sourceDistances[secondSource.id];
  });

  // First connect main spawn to its closest source
  var mainSpawnSource = sources.shift();
  queueProjectIfPossible(room, room.mainSpawn, mainSpawnSource);

  // Second, connect the controller to its closest source
  let controllerSource =
    room.controller?.pos.findClosestByPath(FIND_SOURCES) ?? null;
  queueProjectIfPossible(room, room.controller, controllerSource);

  // If main spawn's closest source is not also the controller's, connect the
  // controller's closest source to main spawn. Remove this source from future
  // consideration
  if (mainSpawnSource?.id !== controllerSource?.id) {
    var controllerSourceIndex = sources.findIndex(
      (source) => controllerSource?.id === source.id
    );
    sources.splice(controllerSourceIndex, 1);
    queueProjectIfPossible(room, room.mainSpawn, controllerSource);
  }

  // Connect the remaining sources to main spawn in ascending order of distance
  sources.forEach((source) =>
    queueProjectIfPossible(room, room.mainSpawn, source)
  );

  // Finally, surround any points of interest with walkways
  queueProjectIfPossible(room, room.mainSpawn);
  room.sources.forEach((source) => queueProjectIfPossible(room, source));
}

function shouldBuild(room: Room, x: number, y: number) {
  var stopBuild = false;

  stopBuild ||= room.getTerrain().get(x, y) === TERRAIN_MASK_WALL;

  var structures = room.lookForAt(LOOK_STRUCTURES, x, y);
  stopBuild ||= structures.some(
    (struct) => struct.structureType !== STRUCTURE_CONTAINER
  );

  return stopBuild;
}

function generateWalkwayPlans(room: Room, id: Id<RoomObject>) {
  var object = Game.getObjectById(id) as RoomObject;
  var { x, y } = object.pos;
  var positions: RoomPosition[] = [];
  [x - 1, x, x + 1].forEach((i) =>
    [y - 1, y, y + 1].forEach((j) => {
      if (!(i === x && j === y) && shouldBuild(room, i, j)) {
        positions.push(new RoomPosition(i, j, room.name));
      }
    })
  );
  return positions;
}

function generateRoadPlans(
  room: Room,
  firstId: Id<RoomObject>,
  secondId: Id<RoomObject>
) {
  var firstObj = Game.getObjectById(firstId) as RoomObject;
  var secondObj = Game.getObjectById(secondId) as RoomObject;
  var results = PathFinder.search(
    firstObj.pos,
    { pos: secondObj.pos, range: 1 },
    { swampCost: 1 }
  );
  return results.path;
}

export function planConstruction(
  room: Room,
  project: [Id<RoomObject>] | [Id<RoomObject>, Id<RoomObject>]
) {
  var positions;
  if (project.length === 1) {
    positions = generateWalkwayPlans(room, project[0]);
  }
  if (project.length === 2) {
    positions = generateRoadPlans(room, project[0], project[1]);
  }

  var roadPlans = Object.create(null);
  roadPlans[STRUCTURE_ROAD] = positions;
  ConstructionQueues.setPlannedConstruction(room, BuildTypes.ROADS, roadPlans);
}
