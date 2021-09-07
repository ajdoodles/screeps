require("./extensions/Room_Extension");
require("./extensions/Source_Extension");

var overseer = require("./overseer");

overseer.init();

module.exports.loop = function () {
  console.log("--------------TICK:" + Game.time + "--------------------------");
  overseer.garbageCollect();
  overseer.runRooms();
  overseer.runCreeps();
};
