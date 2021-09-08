import "./extensions/Room_Extension";
import "./extensions/Source_Extension";

import * as overseer from "./overseer";

overseer.init();

module.exports.loop = function () {
  console.log("--------------TICK:" + Game.time + "--------------------------");
  overseer.garbageCollect();
  overseer.runRooms();
  overseer.runCreeps();
};
