// Polyfill for Node.js environments (including Node 22+)
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const nodeBuffer = require('buffer');
  if (nodeBuffer && !nodeBuffer.SlowBuffer) {
    nodeBuffer.SlowBuffer = nodeBuffer.Buffer;
  }
} catch {
  // ignore
}

// Ensure localStorage is fully functional on the server
if (!globalThis.localStorage || typeof globalThis.localStorage.getItem !== 'function') {
  const store = new Map<string, string>();
  const storagePolyfill = {
    getItem(key: string) {
      const v = store.get(String(key));
      return v === undefined ? null : v;
    },
    setItem(key: string, value: string) {
      store.set(String(key), String(value));
    },
    removeItem(key: string) {
      store.delete(String(key));
    },
    clear() {
      store.clear();
    },
    key(index: number) {
      const keys = Array.from(store.keys());
      return keys[index] ?? null;
    },
    get length() {
      return store.size;
    },
  };

  try {
    Object.defineProperty(globalThis, 'localStorage', {
      value: storagePolyfill,
      configurable: true,
      enumerable: true,
      writable: true,
    });
  } catch {
    (globalThis as any).localStorage = storagePolyfill;
  }
}

