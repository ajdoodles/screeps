var Heap = require("./Heap");

module.exports = (function () {
  Heap.rooms = Heap.rooms || Object.create(null);

  var getRoomHeap = function (room) {
    Heap.rooms[room.name] = Heap.rooms[room.name] || Object.create(null);
    return Heap.rooms[room.name];
  };

  var mPublic = {
    getRoomHeap: getRoomHeap,
  };

  return mPublic;
})();
