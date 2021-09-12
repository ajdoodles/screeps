import { Job } from "../constants/Jobs";
import { Loadout } from "../constants/loadouts";
import LoadoutsTable from "../tables/LoadoutsTable";
import { PIONEER_NAME, PIONEER_BODY } from "../constants/Constants";

export function initSpawnedRecruits(room: Room) {
  while (room.recruits.length > 0 && !Game.creeps[room.recruits[0]].spawning) {
    let recruitName = room.dequeueRecruit() as string;
    let creep = Game.creeps[recruitName];
    if (creep.ticksToLive && creep.ticksToLive < CREEP_LIFE_TIME - 1) {
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
    LoadoutsTable[creep.memory.loadout].init(creep);
  }
}

function recruitRole(room: Room, role: Job) {
  var newName = PIONEER_NAME + Game.time;
  var response = room.mainSpawn.spawnCreep(PIONEER_BODY, newName, {
    memory: {
      loadout: Loadout.PIONEER,
      role: role,
      birthRoom: room.name,
      fetching: false,
    },
  });

  return response === OK ? newName : undefined;
}

export function recruit(room: Room, recruitOrder: Job[]) {
  var recruitName;

  recruitOrder.findIndex((role) => {
    recruitName = recruitRole(room, role);
    return recruitName !== undefined;
  });

  if (recruitName) {
    room.registerRecruit(recruitName);
  }
}
