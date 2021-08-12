var manager = require('manager');

manager.init();

module.exports.loop = function () {
    manager.clearMemory();
    manager.survey();
    manager.recruit();
    manager.run();
}
