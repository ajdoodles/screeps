global.heap = global.heap || Object.create(null);
global.heap.rooms = global.heap.rooms || Object.create(null);

module.exports = (function () {
  var getRoomHeap = function (room) {
    global.heap.rooms[room.name] =
      global.heap.rooms[room.name] || Object.create(null);
    return global.heap.rooms[room.name];
  };

  var mPublic = {
    getRoomHeap: getRoomHeap,
  };

  return mPublic;
})();
