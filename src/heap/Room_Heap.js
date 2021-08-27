module.exports = (function(){

  global.heap = global.heap || {};
  global.heap.rooms = global.heap.rooms || {};
  var mRoomsHeap = global.heap.rooms;

  var getRoomHeap = function(roomName) {
    if (!mRoomsHeap[roomName]) {
      mRoomsHeap[roomName] = {};
    }
    return mRoomsHeap[roomName];
  };

  var mPublic = {};

  return mPublic;
})();
