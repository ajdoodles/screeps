require('extensions/Room_Extension');
require('extensions/Source_Extension');

var overseer = require('overseer');

module.exports.loop = function () {
    overseer.garbageCollect();
    overseer.runRooms();
    overseer.runCreeps();
}
