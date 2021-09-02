module.exports = (function () {
  var RoomsHeap = require("../heap/RoomsHeap");

  Object.defineProperty(Room.prototype, "heap", {
    get: function () {
      return RoomsHeap.getRoomHeap(this);
    },
  });

  Object.defineProperty(Room.prototype, "sources", {
    get: function () {
      if (!this._sources) {
        if (!this.memory.sourceIds) {
          this.memory.sourceIds = this.find(FIND_SOURCES).map(
            (source) => source.id
          );
        }
        this._sources = this.memory.sourceIds.map((id) =>
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
            filter: (spawn) => spawn.spawning !== null,
          })
            .sort(
              (firstSpawning, secondSpawning) =>
                firstSpawning.remainingTime - secondSpawning.remainingTime
            )
            .map((spawn) => spawn.spawning.name);
        }
        this._recruits = Array.from(this.memory.recruits);
      }
      return this._recruits;
    },
    enumerable: false,
    configurable: true,
  });

  Room.prototype.registerRecruit = function (creepName) {
    if (this._recruits) {
      this._recruits.push(creepName);
    }
    this.memory.recruits.push(creepName);
  };

  Room.prototype.dequeueRecruit = function () {
    var nameFromMemory = this.memory.recruits.shift();
    if (this._recruits) {
      let nameFromCache = this._recruits.shift();
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
    x,
    y,
    includeCenter = false
  ) {
    var roomTerrain = this.getTerrain();
    var positions = [];
    const blockedTerrainMask = TERRAIN_MASK_WALL | TERRAIN_MASK_LAVA;
    [x - 1, x, x + 1].forEach((i) => {
      [y - 1, y, y + 1].forEach((j) => {
        if (includeCenter || !(i == x && y == j)) {
          let isBlocked = Boolean(roomTerrain.get(i, j) & blockedTerrainMask);
          if (!isBlocked) {
            positions.push(new RoomPosition(i, j, this.name));
          }
        }
      });
    });
    return positions;
  };
})();
