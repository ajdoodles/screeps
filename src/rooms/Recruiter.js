var recruiter = (function () {
  var mPioneer = require("../roles/pioneer");

  var initSpawnedRecruits = function (room) {
    while (
      room.recruits.length > 0 &&
      !Game.creeps[room.recruits[0]].spawning
    ) {
      let recruitName = room.dequeueRecruit();
      let creep = Game.creeps[recruitName];
      if (creep.ticksToLive < CREEP_LIFE_TIME - 1) {
        // Technically the game 'steals' the first tick for the movement out
        // of the spawn position.
        console.log(
          "WARNING: Initializing [" +
            recruitName +
            "] with less ticks to live than max." +
            "[" +
            creep.ticksToLive +
            "/" +
            CREEP_LIFE_TIME +
            "]"
        );
      }
      mPioneer.init(creep);
    }
  };

  var _recruitRole = function (room, role) {
    var newName = mPioneer.mName + Game.time;
    var response = room.mainSpawn.spawnCreep(mPioneer.mBody, newName, {
      memory: { role: role, birthRoom: room.name },
    });

    return response === OK ? newName : undefined;
  };

  var recruit = function (room, recruitOrder) {
    var recruitName;

    recruitName = recruitOrder.reduce((previousResults, nextRole) => {
      return previousResults ? previousResults : _recruitRole(room, nextRole);
    }, undefined);

    if (recruitName) {
      room.registerRecruit(recruitName);
    }
  };

  var mPublic = {
    recruit: recruit,
    initSpawnedRecruits: initSpawnedRecruits,
  };

  return mPublic;
})();

module.exports = recruiter;
