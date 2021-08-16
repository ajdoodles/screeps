module.exports = (function(){
  Object.defineProperty(
    Room.prototype,
    'sources',
    {
      get: function () {
        if (!this._sources) {
          if (!this.memory.sourceIds) {
            this.memory.sourceIds = this.find(FIND_SOURCES).map((source) => source.id);
          }
          this._sources = this.memory.sourceIds.map((id) => Game.getObjectById(id));
        }
        return this._sources;
      },
      enumerable: false,
      configurable: true
    }
  );

  Object.defineProperty(
    Room.prototype,
    'recruits',
    {
      get: function() {
        if (!this._recruits) {
          if (!this.memory.recruits) {
            this.memory.recruits = this.find(FIND_MY_SPAWNS, {filter: (spawn) => spawn.spawning !== null})
            .sort((firstSpawning, secondSpawning) => firstSpawning.remainingTime - secondSpawning.remainingTime)
            .map((spawn) => spawn.spawning.name);
          }
          this._recruits = this.memory.recruits;
        }
        return this._recruits;
      },
      enumerable: false,
      configurable: true
    }
  );

  Room.prototype.registerRecruit = function (creepName) {
    if (this._recruits) {
      this._recruits.push(creepName);
    }
    this.memory.recruits.push(creepName);
  };

  Room.prototype._dequeueRecruit = function () {
    var nameFromMemory = this.memory.recruits.shift();
    if (this._recruits) {
      let nameFromCache = this._recruits.shift();
      if (nameFromCache !== nameFromMemory) {
        console.log('WARNING: Cached recruit [' + nameFromCache + '] is inconsistent with name in memory [' + nameFromMemory +'] in room ' + this.name + '. Nuking local cache.');
        delete this._recruits;
      }
    }
    return nameFromMemory;
  };

  Room.prototype.initReadyRecruits = function (initFunc) {
    while (this.recruits.length > 0 && !Game.creeps[this.recruits[0]].spawning) {
      initFunc(this._dequeueRecruit());
    }
  };
}());
