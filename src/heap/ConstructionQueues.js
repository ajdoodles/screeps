module.exports = (function(){

  var mRoomsHeap = require('RoomsHeap');

  var _getQueue = function(buildType) {
    if (!mRoomsHeap.constructionQueues) {
      mRoomsHeap.constructionQueues = Object.create(null);
    }
    if (!mRoomsHeap.constructionQueues[buildType]) {
      mRoomsHeap.constructionQueues[buildType] = [];
    }
    return mRoomsHeap.constructionQueues[buildType];
  };

  var isEmpty = function(buildType) {
    return _getQueue(buildType).length === 0;
  };

  var peek = function(buildType) {
    return isEmpty(buildType) ? undefined : _getQueue(buildType)[0];
  };

  var enqueue = function(buildType, project) {
    _getQueue(buildType).push(project);
  };

  var dequeue = function(buildType) {
    return _getQueue(buildType).shift();
  };

  var mPublic = {
    isEmpty: isEmpty,
    peek: peek,
    enqueue: enqueue,
    dequeue: dequeue,
  };

  return mPublic;
})();
