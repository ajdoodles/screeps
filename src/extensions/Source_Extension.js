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
      }
    }
  );

  Object.defineProperty(
    Source.prototype,
    'bufferPos',
    {
      get: function() {
        if (!this._bufferPos) {
          if (!this.memory.bufferPos) {
            const {x, y} = this.pos;
            var surroundings = this.room.getWalkableSurroundings(x, y);
            console.log('found surrounds ' + Object.entries(surroundings));
            var mostFreeSpaces = 0
            var mostFreePos = surroundings.reduce((moreFreePos, nextPos) => {
              let nextSurroundings = this.room.getWalkableSurroundings(nextPos.x, nextPos.y);
              let nextFreeSpaces = nextSurroundings.length;
              if (mostFreeSpaces >= nextFreeSpaces) {
                return moreFreePos;
              }
              mostFreeSpaces = nextFreeSpaces;
              return nextPos;
            });
            this.memory.bufferPos = mostFreePos;
          }
          this._bufferPos = this.memory.bufferPos;
        }
        return this._bufferPos;
      }
    }
  );

  Object.defineProperty(
    Source.prototype,
    'buffer',
    {
      get: function () {
        if (!this._buffer) {
          if (!this.memory.bufferId) {
            var buffer = this.pos.findInRange(
              FIND_STRUCTURES,
              1,
              {filter: (struct) => struct.structureType === STRUCTURE_CONTAINER}
            )[0];
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
    });
}());
