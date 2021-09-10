import { heap } from "./Heap";

declare global {
  interface Heap {
    rooms: Record<string, RoomHeap>;
  }
}

heap.rooms = heap.rooms || Object.create(null);

export function getRoomHeap(room: Room): RoomHeap {
  heap.rooms[room.name] = heap.rooms[room.name] || Object.create(null);
  return heap.rooms[room.name];
}
