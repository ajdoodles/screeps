require('extensions/Room_Extension');
require('extensions/Source_Extension');

var manager = require('manager');

manager.init();

module.exports.loop = function () {
    manager.clearMemory();
    manager.recruit();
    manager.run();
}
