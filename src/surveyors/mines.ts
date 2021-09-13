import { BuildType } from "../constants/BuildTypes";
import * as ConstructionQueues from "../heap/ConstructionQueues";
import { Surveyor } from "./surveyor";

export class MineSurveyor implements Surveyor<BuildType.MINES> {
  survey(room: Room): void {
    if (!ConstructionQueues.isEmpty(room, BuildType.MINES)) {
      return;
    }

    const sourcesWithoutBuffers = room.sources.filter(
      (source) => !source.buffer
    );

    if (sourcesWithoutBuffers.length === 0) {
      return;
    }

    const sourceDistances = Object.create(null);
    sourcesWithoutBuffers.forEach((source) => {
      const results = PathFinder.search(
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
        ConstructionQueues.enqueue(room, BuildType.MINES, source.id);
      });
  }

  planConstruction(room: Room, sourceId: Id<Source>): void {
    const source = Game.getObjectById(sourceId);
    if (source) {
      const site = Object.create(null);
      site[STRUCTURE_CONTAINER] = [source.bufferPos];
      ConstructionQueues.setPlannedConstruction(room, BuildType.MINES, site);
    } else {
      throw `Mine surveyor was given an invalid source id: ${sourceId}`;
    }
  }
}
