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
