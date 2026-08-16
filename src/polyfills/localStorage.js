// Polyfill for Node.js environments (including Node 22+)
try {
  const nodeBuffer = require('buffer');
  if (nodeBuffer && !nodeBuffer.SlowBuffer) {
    nodeBuffer.SlowBuffer = nodeBuffer.Buffer;
  }
} catch (e) {
  // ignore
}

// Ensure localStorage is fully functional on the server
if (!globalThis.localStorage || typeof globalThis.localStorage.getItem !== 'function') {
  const store = new Map();
  const storagePolyfill = {
    getItem: function (key) {
      const v = store.get(String(key));
      return v === undefined ? null : v;
    },
    setItem: function (key, value) {
      store.set(String(key), String(value));
    },
    removeItem: function (key) {
      store.delete(String(key));
    },
    clear: function () {
      store.clear();
    },
    key: function (index) {
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
  } catch (e) {
    globalThis.localStorage = storagePolyfill;
  }
}

