import { Loadout } from "./constants/loadouts";
import LoadoutsTable from "./tables/LoadoutsTable";
import * as RoomRunner from "./rooms/RoomRunner";

export function init() {
  var rootRoomName = Game.spawns["Spawn1"].room.name;
  RoomRunner.init(rootRoomName);
}

export function garbageCollect() {
  for (const [name, memory] of Object.entries(Memory.creeps)) {
    if (!Game.creeps[name]) {
      LoadoutsTable[memory.loadout].cleanUp(name, memory);
      delete Memory.creeps[name];
    }
  }
}

export function runRooms() {
  var rootRoomName = Game.spawns["Spawn1"].room.name;
  RoomRunner.run(rootRoomName);
}

export function runCreeps() {
  for (var creepName in Game.creeps) {
    var creep = Game.creeps[creepName];
    if (!creep.spawning) {
      LoadoutsTable[creep.memory.loadout].run(creep);
    }
  }
}
