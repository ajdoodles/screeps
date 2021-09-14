declare global {
  namespace NodeJS {
    interface Global {
      heap: Heap;
    }
  }
}

if (!global.heap) {
  console.log("WARNING: Rebuilding global heap!");
}
global.heap = global.heap || Object.create(null);
export const heap: Heap = global.heap;
