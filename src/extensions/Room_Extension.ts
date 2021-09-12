import { getRoomHeap } from "../heap/RoomsHeap";

declare global {
  interface Room {
    heap: RoomHeap;
    sources: Source[];
    mainSpawn: StructureSpawn;
    _recruits?: string[];
    recruits: string[];
    dequeueRecruit(): string | undefined;
    registerRecruit(creepName: string): void;
    getWalkableSurroundings(
      x: number,
      y: number,
      includeCenter: boolean
    ): RoomPosition[];
  }

  interface RoomMemory {
    recruits: string[];
    mainSpawnId: Id<StructureSpawn>;
    sourceIds: Id<Source>[];
  }
}

Object.defineProperty(Room.prototype, "heap", {
  get: function () {
    return getRoomHeap(this);
  },
});

Object.defineProperty(Room.prototype, "sources", {
  get: function () {
    if (!this._sources) {
      if (!this.memory.sourceIds) {
        this.memory.sourceIds = this.find(FIND_SOURCES).map(
          (source: Source) => source.id
        );
      }
      this._sources = this.memory.sourceIds.map((id: Id<Source>) =>
        Game.getObjectById(id)
      );
    }
    return this._sources;
  },
  enumerable: false,
  configurable: true,
});

Object.defineProperty(Room.prototype, "mainSpawn", {
  get: function () {
    if (!this._mainSpawn) {
      if (!this.memory.mainSpawnId) {
        this.memory.mainSpawnId = this.find(FIND_MY_SPAWNS)[0].id;
      }
      this._mainSpawn = Game.getObjectById(this.memory.mainSpawnId);
    }
    return this._mainSpawn;
  },
});

Object.defineProperty(Room.prototype, "recruits", {
  get: function () {
    if (!this._recruits) {
      if (!this.memory.recruits) {
        this.memory.recruits = this.find(FIND_MY_SPAWNS, {
          filter: (spawn: StructureSpawn) => spawn.spawning !== null,
        })
          .sort(
            (firstSpawning: Spawning, secondSpawning: Spawning) =>
              firstSpawning.remainingTime - secondSpawning.remainingTime
          )
          .map((spawn: { spawning: Spawning }) => spawn.spawning.name);
      }
      this._recruits = Array.from(this.memory.recruits);
    }
    return this._recruits;
  },
  enumerable: false,
  configurable: true,
});

Room.prototype.registerRecruit = function (creepName: string) {
  if (this._recruits) {
    this._recruits.push(creepName);
  }
  this.memory.recruits.push(creepName);
};

Room.prototype.dequeueRecruit = function (): string | undefined {
  const nameFromMemory = this.memory.recruits.shift();
  if (this._recruits) {
    const nameFromCache = this._recruits.shift();
    if (nameFromCache !== nameFromMemory) {
      console.log(
        "WARNING: Cached recruit [" +
          nameFromCache +
          "] is inconsistent with name in memory [" +
          nameFromMemory +
          "] in room " +
          this.name +
          ". Nuking local cache."
      );
      delete this._recruits;
    }
  }
  return nameFromMemory;
};

Room.prototype.getWalkableSurroundings = function (
  x: number,
  y: number,
  includeCenter = false
): RoomPosition[] {
  const roomTerrain = this.getTerrain();
  const positions: RoomPosition[] = [];
  const blockedTerrainMask = TERRAIN_MASK_WALL | TERRAIN_MASK_LAVA;
  [x - 1, x, x + 1].forEach((i) => {
    [y - 1, y, y + 1].forEach((j) => {
      if (includeCenter || !(i == x && y == j)) {
        const isBlocked = Boolean(roomTerrain.get(i, j) & blockedTerrainMask);
        if (!isBlocked) {
          positions.push(new RoomPosition(i, j, this.name));
        }
      }
    });
  });
  return positions;
};
