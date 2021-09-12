import LoadoutsTable from "./tables/LoadoutsTable";
import * as RoomRunner from "./rooms/RoomRunner";

export function init(): void {
  const rootRoomName = Game.spawns["Spawn1"].room.name;
  RoomRunner.init(rootRoomName);
}

export function garbageCollect(): void {
  for (const [name, memory] of Object.entries(Memory.creeps)) {
    if (!Game.creeps[name]) {
      LoadoutsTable[memory.loadout].cleanUp(name, memory);
      delete Memory.creeps[name];
    }
  }
}

export function runRooms(): void {
  const rootRoomName = Game.spawns["Spawn1"].room.name;
  RoomRunner.run(rootRoomName);
}

export function runCreeps(): void {
  for (const creepName in Game.creeps) {
    const creep = Game.creeps[creepName];
    if (!creep.spawning) {
      LoadoutsTable[creep.memory.loadout].run(creep);
    }
  }
}
