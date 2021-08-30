module.exports = (function(){

  var _getQueues = function(room) {
    room.heap.constructionQueues = room.heap.constructionQueues || Object.create(null);
    return room.heap.constructionQueues;
  };

  var _getQueue = function(room, buildType) {
    var queues = _getQueues(room);
    queues[buildType] = queues[buildType] || [];
    return queues[buildType];
  };

  var isEmpty = function(room, buildType) {
    return _getQueue(buildType).length === 0;
  };

  var peek = function(room, buildType) {
    return isEmpty(buildType) ? undefined : _getQueue(room, buildType)[0];
  };

  var enqueue = function(room, buildType, project) {
    _getQueue(room, buildType).push(project);
  };

  var dequeue = function(room, buildType) {
    return _getQueue(room, buildType).shift();
  };

  var getActiveConstruction = function(room) {
    return _getQueue(room, BuildTypes.ACTIVE);
  };

  var mPublic = {
    isEmpty: isEmpty,
    peek: peek,
    enqueue: enqueue,
    dequeue: dequeue,
  };

  return mPublic;
})();
