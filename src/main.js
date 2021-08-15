var manager = require('manager');

manager.init();

module.exports.loop = function () {
    manager.clearMemory();
    manager.recruit();
    manager.run();
}
