// Ensure a minimal `localStorage` exists on the Node/server runtime so
// imports that assume a browser environment do not throw during SSR.
if (typeof globalThis.localStorage === "undefined") {
  // lightweight stub: only implement methods used by dependencies
  (globalThis as any).localStorage = {
    getItem: (_: string) => null,
    setItem: (_: string, __: string) => undefined,
    removeItem: (_: string) => undefined,
    clear: () => undefined,
  };
}

import { genkit } from "genkit";

// Avoid importing `@genkit-ai/google-genai` at module load time because
// the package expects browser globals and can throw during SSR. For local
// development we'll initialize `genkit` without the Google plugin. To enable
// the plugin, initialize it dynamically in client-only code or set up a
// server-safe wrapper that loads it conditionally.
export const ai = genkit({
  plugins: [],
  model: "googleai/gemini-2.5-flash",
});
