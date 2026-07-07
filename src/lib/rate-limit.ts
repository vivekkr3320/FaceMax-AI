// Simple In-Memory Rate Limiter for Next.js API endpoints
const ipCache = (global as any).rateLimitCache || new Map<string, { count: number; resetTime: number }>();
if (!(global as any).rateLimitCache) {
  (global as any).rateLimitCache = ipCache;
}

export function isRateLimited(ip: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = ipCache.get(ip);

  if (!record) {
    ipCache.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    return false;
  }

  if (now > record.resetTime) {
    // Reset window
    record.count = 1;
    record.resetTime = now + windowMs;
    ipCache.set(ip, record);
    return false;
  }

  record.count += 1;
  ipCache.set(ip, record);

  return record.count > limit;
}
