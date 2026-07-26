// Jednostavan in-memory localStorage mock za unit testove.
// Moduli u src/lib/ citaju localStorage na svaki poziv (nema kesiranja u closures),
// pa je dovoljno instalirati mock jednom i resetovati ga sa .clear() izmedju testova.

export function createLocalStorageMock() {
  const store = new Map();
  return {
    getItem: (key) => (store.has(String(key)) ? store.get(String(key)) : null),
    setItem: (key, value) => {
      store.set(String(key), String(value));
    },
    removeItem: (key) => {
      store.delete(String(key));
    },
    clear: () => {
      store.clear();
    },
    get length() {
      return store.size;
    },
    key: (index) => Array.from(store.keys())[index] ?? null,
  };
}

// Instalira `window` i `localStorage` na globalThis (Node ih nema po defaultu).
// Koristi defineProperty jer noviji Node moze imati lazy getter za localStorage.
// Vraca mock da testovi mogu da ga resetuju/seeduju.
export function installBrowserGlobals() {
  const mock = createLocalStorageMock();
  Object.defineProperty(globalThis, "window", {
    value: {},
    configurable: true,
    writable: true,
  });
  Object.defineProperty(globalThis, "localStorage", {
    value: mock,
    configurable: true,
    writable: true,
  });
  return mock;
}
