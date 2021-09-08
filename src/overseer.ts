import mPioneer from "./roles/pioneer";
import RoomRunner from "./rooms/RoomRunner";

export function init() {
  var rootRoomName = Game.spawns["Spawn1"].room.name;
  RoomRunner.init(rootRoomName);
};

export function garbageCollect() {
  for (const [name, memory] of Object.entries(Memory.creeps)) {
    if (!Game.creeps[name]) {
      mPioneer.cleanUp(name, memory);
      delete Memory.creeps[name];
    }
  }
};

export function runRooms() {
  var rootRoomName = Game.spawns["Spawn1"].room.name;
  RoomRunner.run(rootRoomName);
};

export function runCreeps() {
  for (var creepName in Game.creeps) {
    var screep = Game.creeps[creepName];
    if (!screep.spawning) {
      mPioneer.run(screep);
    }
  }
};
