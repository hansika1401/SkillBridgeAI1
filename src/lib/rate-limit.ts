type Window = { count: number; resetAt: number };

const DEFAULT_LIMIT = 30;
const DEFAULT_WINDOW_MS = 60_000;

// Persist across hot reloads in dev
const globalKey = Symbol.for("skillbridge.rateLimitStore");
// @ts-ignore
const store: Map<string, Window> = (globalThis as any)[globalKey] || new Map();
// @ts-ignore
(globalThis as any)[globalKey] = store;

export type RateLimitOptions = { limit?: number; windowMs?: number };

export function rateLimit(key: string, opts: RateLimitOptions = {}) {
  const limit = opts.limit ?? DEFAULT_LIMIT;
  const windowMs = opts.windowMs ?? DEFAULT_WINDOW_MS;
  const now = Date.now();
  const bucket = store.get(key);
  if (!bucket || bucket.resetAt <= now) {
    const next: Window = { count: 1, resetAt: now + windowMs };
    store.set(key, next);
    return { allowed: true, remaining: limit - 1, resetAt: next.resetAt };
  }
  if (bucket.count < limit) {
    bucket.count += 1;
    return { allowed: true, remaining: limit - bucket.count, resetAt: bucket.resetAt };
  }
  return { allowed: false, remaining: 0, resetAt: bucket.resetAt };
}
