interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
}

interface RateLimitState {
  attempts: number;
  lastAttempt: number;
}

class RateLimiter {
  private static instance: RateLimiter;
  private limits: Map<string, RateLimitState>;
  private config: RateLimitConfig;

  private constructor(config: RateLimitConfig = { maxAttempts: 5, windowMs: 15 * 60 * 1000 }) {
    this.limits = new Map();
    this.config = config;
  }

  public static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  public isRateLimited(key: string): boolean {
    const now = Date.now();
    const state = this.limits.get(key);

    if (!state) {
      this.limits.set(key, { attempts: 1, lastAttempt: now });
      return false;
    }

    // Reset if window has passed
    if (now - state.lastAttempt > this.config.windowMs) {
      this.limits.set(key, { attempts: 1, lastAttempt: now });
      return false;
    }

    // Increment attempts
    state.attempts++;
    state.lastAttempt = now;

    // Check if rate limited
    if (state.attempts > this.config.maxAttempts) {
      return true;
    }

    return false;
  }

  public reset(key: string): void {
    this.limits.delete(key);
  }

  public getRemainingAttempts(key: string): number {
    const state = this.limits.get(key);
    if (!state) return this.config.maxAttempts;
    return Math.max(0, this.config.maxAttempts - state.attempts);
  }

  public getTimeUntilReset(key: string): number {
    const state = this.limits.get(key);
    if (!state) return 0;
    const timeElapsed = Date.now() - state.lastAttempt;
    return Math.max(0, this.config.windowMs - timeElapsed);
  }
}

export const rateLimiter = RateLimiter.getInstance(); 