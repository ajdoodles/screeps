import { BuildType } from "../constants/BuildTypes";
import * as ConstructionQueues from "../heap/ConstructionQueues";
import { Surveyor } from "./surveyor";

export class RoadSurveyor implements Surveyor<BuildType.ROADS> {
  private queueProjectIfPossible(
    room: Room,
    from: { id: Id<RoomObject> } | undefined | null,
    to?: { id: Id<RoomObject> } | undefined | null
  ) {
    if (!from) {
      return;
    }

    if (to) {
      ConstructionQueues.enqueue(room, BuildType.ROADS, [from.id, to.id]);
    } else {
      ConstructionQueues.enqueue(room, BuildType.ROADS, [from.id]);
    }
  }

  public survey(room: Room): void {
    if (!ConstructionQueues.isEmpty(room, BuildType.ROADS)) {
      return;
    }

    const sourceDistances = Object.create(null);
    const sources = Array.from(room.sources);
    sources.forEach((source) => {
      const results = PathFinder.search(
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
    const mainSpawnSource = sources.shift();
    this.queueProjectIfPossible(room, room.mainSpawn, mainSpawnSource);

    // Second, connect the controller to its closest source
    const controllerSource =
      room.controller?.pos.findClosestByPath(FIND_SOURCES) ?? null;
    this.queueProjectIfPossible(room, room.controller, controllerSource);

    // If main spawn's closest source is not also the controller's, connect the
    // controller's closest source to main spawn. Remove this source from future
    // consideration
    if (mainSpawnSource?.id !== controllerSource?.id) {
      const controllerSourceIndex = sources.findIndex(
        (source) => controllerSource?.id === source.id
      );
      sources.splice(controllerSourceIndex, 1);
      this.queueProjectIfPossible(room, room.mainSpawn, controllerSource);
    }

    // Connect the remaining sources to main spawn in ascending order of distance
    sources.forEach((source) =>
      this.queueProjectIfPossible(room, room.mainSpawn, source)
    );

    // Finally, surround any points of interest with walkways
    this.queueProjectIfPossible(room, room.mainSpawn);
    room.sources.forEach((source) => this.queueProjectIfPossible(room, source));
  }

  private shouldBuild(room: Room, x: number, y: number) {
    let stopBuild = false;

    stopBuild ||= room.getTerrain().get(x, y) === TERRAIN_MASK_WALL;

    const structures = room.lookForAt(LOOK_STRUCTURES, x, y);
    stopBuild ||= structures.some(
      (struct) => struct.structureType !== STRUCTURE_CONTAINER
    );

    return stopBuild;
  }

  private generateWalkwayPlans(room: Room, id: Id<RoomObject>) {
    const object = Game.getObjectById(id) as RoomObject;
    const { x, y } = object.pos;
    const positions: RoomPosition[] = [];
    [x - 1, x, x + 1].forEach((i) =>
      [y - 1, y, y + 1].forEach((j) => {
        if (!(i === x && j === y) && this.shouldBuild(room, i, j)) {
          positions.push(new RoomPosition(i, j, room.name));
        }
      })
    );
    return positions;
  }

  private generateRoadPlans(firstId: Id<RoomObject>, secondId: Id<RoomObject>) {
    const firstObj = Game.getObjectById(firstId) as RoomObject;
    const secondObj = Game.getObjectById(secondId) as RoomObject;
    const results = PathFinder.search(
      firstObj.pos,
      { pos: secondObj.pos, range: 1 },
      { swampCost: 1 }
    );
    return results.path;
  }

  public planConstruction(
    room: Room,
    project: [Id<RoomObject>] | [Id<RoomObject>, Id<RoomObject>]
  ): void {
    let positions;
    if (project.length === 1) {
      positions = this.generateWalkwayPlans(room, project[0]);
    } else if (project.length === 2) {
      positions = this.generateRoadPlans(project[0], project[1]);
    }

    const roadPlans = Object.create(null);
    roadPlans[STRUCTURE_ROAD] = positions;
    ConstructionQueues.setPlannedConstruction(room, BuildType.ROADS, roadPlans);
  }
}
