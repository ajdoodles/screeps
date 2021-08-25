module.exports = (function(){
  Object.defineProperty(
    Source.prototype,
    'memory',
    {
      get: function() {
        if (!Memory.mySourcesMemory) {
          Memory.mySourcesMemory = {};
        }
        return Memory.mySourcesMemory[this.id] = Memory.mySourcesMemory[this.id] || {};
      },
      enumerable: false,
      configurable: true
    }
  );

  Object.defineProperty(
    Source.prototype,
    'bufferPos',
    {
      get: function() {
        if (!this._bufferPos) {
          if (!this.memory.bufferPos) {
            var {x:sourceX, y:sourceY} = this.pos;
            var surroundings = this.room.getWalkableSurroundings(sourceX, sourceY);

            var highestFreeSpaceCount = 0
            var candidates = [];

            surroundings.forEach((candidatePos) => {
              var nextSurroundings = this.room.getWalkableSurroundings(candidatePos.x, candidatePos.y);
              var nextFreeSpaceCount = nextSurroundings.length;

              if (nextFreeSpaceCount >= highestFreeSpaceCount) {
                if (nextFreeSpaceCount > highestFreeSpaceCount) {
                  candidates = [];
                  highestFreeSpaceCount = nextFreeSpaceCount;
                }
                candidates.push(candidatePos);
              }
            });

            var spawn = this.room.find(FIND_MY_SPAWNS)[0];
            var results = PathFinder.search(spawn.pos, candidates, {swampCost: 1});
            var mostFreePos = results.path[results.path.length - 1];

            this.memory.bufferPos = mostFreePos;
          }
          this._bufferPos = this.memory.bufferPos;
        }
        return this._bufferPos;
      },
      enumerable: false,
      configurable: true
    }
  );

  Object.defineProperty(
    Source.prototype,
    'buffer',
    {
      get: function () {
        if (!this._buffer) {
          if (!this.memory.bufferId) {
            let {x: bufferX, y: bufferY} = this.bufferPos;
            let buffers = this.room.lookForAt(LOOK_STRUCTURES, bufferX, bufferY);
            let buffer = buffers.length > 0 ? buffers[0] : null;

            if (!buffer) {
              buffer = this.pos.findInRange(
                FIND_STRUCTURES,
                1,
                {filter: (struct) => struct.structureType === STRUCTURE_CONTAINER}
              )[0];
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
      configurable: true
    }
  );
}());
