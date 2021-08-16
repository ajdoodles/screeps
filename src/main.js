require('extensions/Room_Extension');
require('extensions/Source_Extension');

var manager = require('manager');

const rootRoomName = Game.spawns['Spawn1'].room.name;

manager.init();

module.exports.loop = function () {
    manager.clearMemory();
    manager.recruit(rootRoomName);
    manager.run();
}
