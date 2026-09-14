/**
 * Circuit Breaker Pattern for Shopping Providers
 * 
 * Prevents cascading failures by tracking provider health and
 * temporarily disabling providers that are experiencing issues.
 */

export interface CircuitBreakerState {
  status: 'closed' | 'open' | 'half-open';
  failureCount: number;
  successCount: number;
  lastFailureTime: number | null;
  lastSuccessTime: number | null;
  nextAttemptTime: number | null;
}

export interface CircuitBreakerConfig {
  failureThreshold: number;    // Number of failures before opening circuit
  successThreshold: number;    // Number of successes before closing circuit
  timeout: number;             // Time in ms before trying again (half-open)
  monitorWindow: number;       // Time window for counting failures
}

const DEFAULT_CONFIG: CircuitBreakerConfig = {
  failureThreshold: 3,
  successThreshold: 2,
  timeout: 30000, // 30 seconds
  monitorWindow: 60000, // 1 minute
};

export class CircuitBreaker {
  private state: CircuitBreakerState;
  private config: CircuitBreakerConfig;
  private failureTimestamps: number[] = [];

  constructor(config: Partial<CircuitBreakerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.state = {
      status: 'closed',
      failureCount: 0,
      successCount: 0,
      lastFailureTime: null,
      lastSuccessTime: null,
      nextAttemptTime: null,
    };
  }

  /**
   * Check if the circuit is allowing requests
   */
  canExecute(): boolean {
    if (this.state.status === 'closed') {
      return true;
    }

    if (this.state.status === 'open') {
      // Check if timeout has elapsed
      if (this.state.nextAttemptTime && Date.now() >= this.state.nextAttemptTime) {
        this.state.status = 'half-open';
        return true;
      }
      return false;
    }

    // half-open: allow one request
    return true;
  }

  /**
   * Record a successful execution
   */
  recordSuccess(): void {
    this.state.successCount++;
    this.state.lastSuccessTime = Date.now();

    if (this.state.status === 'half-open') {
      // Enough successes to close the circuit
      if (this.state.successCount >= this.config.successThreshold) {
        this.state.status = 'closed';
        this.state.failureCount = 0;
        this.state.successCount = 0;
        this.failureTimestamps = [];
      }
    }

    if (this.state.status === 'closed') {
      // Reset failure count on success
      this.state.failureCount = Math.max(0, this.state.failureCount - 1);
    }
  }

  /**
   * Record a failed execution
   */
  recordFailure(): void {
    const now = Date.now();
    this.state.failureCount++;
    this.state.lastFailureTime = now;
    this.state.successCount = 0;

    // Track failure timestamps for windowed counting
    this.failureTimestamps.push(now);
    
    // Remove old failures outside the monitor window
    this.failureTimestamps = this.failureTimestamps.filter(
      ts => now - ts < this.config.monitorWindow
    );

    // Check if we should open the circuit
    if (this.failureTimestamps.length >= this.config.failureThreshold) {
      this.state.status = 'open';
      this.state.nextAttemptTime = now + this.config.timeout;
    }
  }

  /**
   * Get current circuit state
   */
  getState(): CircuitBreakerState {
    return { ...this.state };
  }

  /**
   * Get circuit status as a string
   */
  getStatus(): string {
    return this.state.status;
  }

  /**
   * Check if circuit is open (blocking requests)
   */
  isOpen(): boolean {
    return this.state.status === 'open';
  }

  /**
   * Check if circuit is half-open (testing recovery)
   */
  isHalfOpen(): boolean {
    return this.state.status === 'half-open';
  }

  /**
   * Check if circuit is closed (normal operation)
   */
  isClosed(): boolean {
    return this.state.status === 'closed';
  }

  /**
   * Reset circuit to closed state
   */
  reset(): void {
    this.state = {
      status: 'closed',
      failureCount: 0,
      successCount: 0,
      lastFailureTime: null,
      lastSuccessTime: null,
      nextAttemptTime: null,
    };
    this.failureTimestamps = [];
  }
}

/**
 * Circuit Breaker Registry
 * Manages circuit breakers for multiple providers
 */
export class CircuitBreakerRegistry {
  private breakers: Map<string, CircuitBreaker> = new Map();
  private config: CircuitBreakerConfig;

  constructor(config: Partial<CircuitBreakerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Get or create a circuit breaker for a provider
   */
  getBreaker(providerName: string): CircuitBreaker {
    if (!this.breakers.has(providerName)) {
      this.breakers.set(providerName, new CircuitBreaker(this.config));
    }
    return this.breakers.get(providerName)!;
  }

  /**
   * Check if a provider can execute
   */
  canExecute(providerName: string): boolean {
    return this.getBreaker(providerName).canExecute();
  }

  /**
   * Record success for a provider
   */
  recordSuccess(providerName: string): void {
    this.getBreaker(providerName).recordSuccess();
  }

  /**
   * Record failure for a provider
   */
  recordFailure(providerName: string): void {
    this.getBreaker(providerName).recordFailure();
  }

  /**
   * Get status of all providers
   */
  getStatus(): Record<string, CircuitBreakerState> {
    const status: Record<string, CircuitBreakerState> = {};
    for (const [name, breaker] of this.breakers) {
      status[name] = breaker.getState();
    }
    return status;
  }

  /**
   * Reset a specific provider's circuit breaker
   */
  reset(providerName: string): void {
    const breaker = this.breakers.get(providerName);
    if (breaker) {
      breaker.reset();
    }
  }

  /**
   * Reset all circuit breakers
   */
  resetAll(): void {
    for (const breaker of this.breakers.values()) {
      breaker.reset();
    }
  }
}

// Export singleton instance
export const circuitBreakerRegistry = new CircuitBreakerRegistry();
