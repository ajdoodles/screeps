import BuildTypes from "../constants/BuildTypes";
import * as ConstructionQueues from "../heap/ConstructionQueues";

export function survey(room: Room) {
  if (!ConstructionQueues.isEmpty(room, BuildTypes.MINES)) {
    return;
  }

  var sourcesWithoutBuffers = room.sources.filter((source) => !source.buffer);

  if (sourcesWithoutBuffers.length === 0) {
    return;
  }

  var sourceDistances = Object.create(null);
  sourcesWithoutBuffers.forEach((source) => {
    var results = PathFinder.search(
      room.mainSpawn.pos,
      { pos: source.pos, range: 1 },
      { swampCost: 1 }
    );
    sourceDistances[source.id] = results.path.length;
  });
  sourcesWithoutBuffers
    .sort(
      (firstSource, secondSource) =>
        sourceDistances[firstSource.id] - sourceDistances[secondSource.id]
    )
    .forEach((source) => {
      ConstructionQueues.enqueue(room, BuildTypes.MINES, source.id);
    });
}

export function planConstruction(room: Room, sourceId: Id<Source>) {
  var site = Object.create(null);
  site[STRUCTURE_CONTAINER] = [Game.getObjectById(sourceId)!.bufferPos];
  ConstructionQueues.setPlannedConstruction(room, BuildTypes.MINES, site);
}
