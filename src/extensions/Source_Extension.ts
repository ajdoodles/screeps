import "./Creep_Extension";

import Jobs from "../constants/Jobs";

declare global {
  interface Memory {
    mySourcesMemory: { [id: string]: SourceMemory };
  }

  interface SourceMemory {
    pioneerIds: Id<Creep>[];
    minerId: Id<Creep>;
    bufferPos: RoomPosition;
    bufferId: Id<StructureContainer>;
  }

  interface Source {
    memory: SourceMemory;
    pioneers: Creep[];
    miner: Creep | null;
    bufferPos: RoomPosition;
    buffer: StructureContainer;
  }
}

Object.defineProperty(Source.prototype, "memory", {
  get: function () {
    if (!Memory.mySourcesMemory) {
      Memory.mySourcesMemory = {};
    }
    return (Memory.mySourcesMemory[this.id] =
      Memory.mySourcesMemory[this.id] || {});
  },
  enumerable: false,
  configurable: true,
});

Object.defineProperty(Source.prototype, "pioneers", {
  get: function () {
    if (!this._pioneers) {
      if (this.memory.pioneerIds) {
        this.memory.pioneerIds = this.memory.pioneerIds.filter(
          (id: Id<Creep>) => Game.getObjectById(id)
        );
      }
    }

    if (!this._pioneers) {
      if (!this.memory.pioneerIds) {
        var pioneers = Object.values(Game.creeps).filter((creep: Creep) => {
          var myPioneer = false;
          creep.memory.sourceId === this.id;
          if (creep.memory.sourceId) {
            myPioneer = creep.memory.sourceId === this.id;
          } else if (creep.memory.bufferId) {
            myPioneer = this.buffer && this.buffer.id === creep.memory.bufferId;
          }
          return myPioneer;
        });
        this.memory.pioneerIds = pioneers.map((pioneer: Creep) => pioneer.id);
      }
      this._pioneers = this.memory.pioneerIds.map((id: Id<Creep>) =>
        Game.getObjectById(id)
      );
    }
    return this._pioneers;
  },
  enumerable: false,
  configurable: true,
});

Object.defineProperty(Source.prototype, "miner", {
  get: function () {
    if (!this._miner) {
      this._miner = Game.getObjectById(this.memory.minerId);
    }

    if (!this._miner) {
      if (!this.memory.minerId) {
        var miner = Object.values(Game.creeps).find((creep: Creep) => {
          creep.memory.role === Jobs.MINE && creep.memory.sourceId === this.id;
        });
        if (miner) {
          this.memory.minerId = miner.id;
        } else {
          delete this.memory.minerId;
        }
      }
      this._miner = Game.getObjectById(this.memory.minerId);
    }
    return this._miner;
  },
  set: function (creep) {
    this._miner = creep;
    if (creep) {
      this.memory.minerId = creep.id;
    } else {
      delete this.memory.minerId;
    }
  },
  enumerable: false,
  configurable: true,
});

Object.defineProperty(Source.prototype, "bufferPos", {
  get: function () {
    if (!this._bufferPos) {
      if (!this.memory.bufferPos) {
        var { x: sourceX, y: sourceY } = this.pos;
        var surroundings = this.room.getWalkableSurroundings(sourceX, sourceY);

        var highestFreeSpaceCount = 0;
        var candidates: RoomPosition[] = [];

        surroundings.forEach((candidatePos: RoomPosition) => {
          var nextSurroundings = this.room.getWalkableSurroundings(
            candidatePos.x,
            candidatePos.y
          );
          var nextFreeSpaceCount = nextSurroundings.length;

          if (nextFreeSpaceCount >= highestFreeSpaceCount) {
            if (nextFreeSpaceCount > highestFreeSpaceCount) {
              candidates = [];
              highestFreeSpaceCount = nextFreeSpaceCount;
            }
            candidates.push(candidatePos);
          }
        });

        var spawnPos = this.room.mainSpawn.pos;
        var results = PathFinder.search(spawnPos, candidates, {
          swampCost: 1,
        });
        var mostFreePos = results.path[results.path.length - 1];

        this.memory.bufferPos = mostFreePos;
      }
      this._bufferPos = this.memory.bufferPos;
    }
    return this._bufferPos;
  },
  enumerable: false,
  configurable: true,
});

Object.defineProperty(Source.prototype, "buffer", {
  get: function () {
    if (!this._buffer) {
      if (!this.memory.bufferId) {
        let { x: bufferX, y: bufferY } = this.bufferPos;
        let buffers = this.room.lookForAt(LOOK_STRUCTURES, bufferX, bufferY);
        let buffer = buffers.length > 0 ? buffers[0] : null;

        if (!buffer) {
          buffer = this.pos.findInRange(FIND_STRUCTURES, 1, {
            filter: (struct: Structure) =>
              struct.structureType === STRUCTURE_CONTAINER,
          })[0];
        }

        if (buffer) {
          this.memory.bufferId = buffer.id;
        } else {
          delete this.memory.bufferId;
        }
      }
      this._buffer = Game.getObjectById(this.memory.bufferId);
    }
    return this._buffer;
  },
  enumerable: false,
  configurable: true,
});
