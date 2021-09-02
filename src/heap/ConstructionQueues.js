module.exports = (function () {
  var _getQueues = function (room) {
    room.heap.constructionQueues =
      room.heap.constructionQueues || Object.create(null);
    return room.heap.constructionQueues;
  };

  var _newQueue = function () {
    var queue = [];
    queue.planned = queue.planned || Object.create(null);
    return queue;
  };

  var _getQueue = function (room, buildType) {
    var queues = _getQueues(room);
    queues[buildType] = queues[buildType] || _newQueue();
    return queues[buildType];
  };

  var isEmpty = function (room, buildType) {
    return _getQueue(room, buildType).length === 0;
  };

  var peek = function (room, buildType) {
    return isEmpty(room, buildType) ? undefined : _getQueue(room, buildType)[0];
  };

  var enqueue = function (room, buildType, project) {
    _getQueue(room, buildType).push(project);
  };

  var dequeue = function (room, buildType) {
    return _getQueue(room, buildType).shift();
  };

  var hasPlannedConstruction = function (room, buildType) {
    var plannedWork = _getQueue(room, buildType).planned;
    return Object.getOwnPropertyNames(plannedWork).length !== 0;
  };

  var getPlannedConstruction = function (room, buildType) {
    return _getQueue(room, buildType).planned;
  };

  var setPlannedConstruction = function (room, buildType, plans) {
    _getQueue(room, buildType).planned = plans;
  };

  var mPublic = {
    isEmpty: isEmpty,
    peek: peek,
    enqueue: enqueue,
    dequeue: dequeue,
    hasPlannedConstruction: hasPlannedConstruction,
    getPlannedConstruction: getPlannedConstruction,
    setPlannedConstruction: setPlannedConstruction,
  };

  return mPublic;
})();
