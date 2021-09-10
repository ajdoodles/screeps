declare global {
  namespace NodeJS {
    interface Global {
      heap: Heap;
    }
  }
}

global.heap = global.heap || Object.create(null);
export const heap: Heap = global.heap;
