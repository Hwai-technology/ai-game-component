export class VirtualClock {
  private currentTime = 0;

  constructor(initialTime = 0) {
    this.currentTime = initialTime;
  }

  public now(): number {
    return this.currentTime;
  }

  public tick(deltaMs: number): number {
    if (deltaMs < 0) {
      throw new Error('VirtualClock: deltaMs cannot be negative');
    }
    this.currentTime += deltaMs;
    return this.currentTime;
  }

  public reset(time = 0): void {
    this.currentTime = time;
  }
}

export class MockEventSink<T = unknown> {
  public readonly calls: T[] = [];

  public handler = (payload: T): void => {
    this.calls.push(payload);
  };

  public get count(): number {
    return this.calls.length;
  }

  public get latest(): T | undefined {
    return this.calls[this.calls.length - 1];
  }

  public clear(): void {
    this.calls.length = 0;
  }
}

export function assertApproxEqual(actual: number, expected: number, epsilon = 0.001): boolean {
  return Math.abs(actual - expected) <= epsilon;
}

