module.exports = (function(){
  Memory.sourceBufferId = {};
  Object.defineProperty(
    Source.prototype,
    'buffer',
    {
      get: function () {
        if (!this._buffer) {

          if (!Memory.sourceBufferId[this.id]) {
            var buffer = this.pos.findInRange(
              FIND_STRUCTURES,
              1,
              {filter: (struct) => struct.structureType === STRUCTURE_CONTAINER || struct.structureType === STRUCTURE_STORAGE}
            )[0];
            if (buffer) {
              Memory.sourceBufferId[this.id] = buffer.id;
            } else {
              delete Memory.sourceBufferId[this.id];
            }
          }
          this._buffer = Game.getObjectById(Memory.sourceBufferId[this.id]);
        }
        return this._buffer;
      },
      enumerable: false,
      configurable: true
    });
}());
