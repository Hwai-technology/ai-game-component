import { Disposable } from '../../../../core/shared-types/src/index.js';
import {
  AppLifecycleState,
  GameLifecycleConfig,
  ILifecyclePlatformAdapter,
  LifecycleListener,
  ResumePolicy,
} from '../types/index.js';

export class MockLifecycleAdapter implements ILifecyclePlatformAdapter {
  private currentState: AppLifecycleState = 'active';
  private readonly listeners = new Set<(state: AppLifecycleState) => void>();

  public getCurrentState(): AppLifecycleState {
    return this.currentState;
  }

  public simulateStateChange(nextState: AppLifecycleState): void {
    this.currentState = nextState;
    for (const listener of this.listeners) {
      listener(nextState);
    }
  }

  public subscribe(listener: (state: AppLifecycleState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export class GameLifecycleManager implements Disposable {
  private readonly adapter: ILifecyclePlatformAdapter;
  private readonly resumePolicy: ResumePolicy;
  private readonly autoPauseOnBackground: boolean;
  private readonly listeners = new Set<LifecycleListener>();
  private readonly pauseHooks = new Set<() => void>();
  private readonly resumeHooks = new Set<() => void>();
  private currentState: AppLifecycleState;
  private wasRunningBeforeBackground = false;
  private unsubscribeAdapter?: () => void;
  private _isDisposed = false;

  constructor(
    config: GameLifecycleConfig = {},
    adapter: ILifecyclePlatformAdapter = new MockLifecycleAdapter()
  ) {
    this.resumePolicy = config.resumePolicy ?? 'remain_paused';
    this.autoPauseOnBackground = config.autoPauseOnBackground ?? true;
    this.adapter = adapter;
    this.currentState = adapter.getCurrentState();

    this.unsubscribeAdapter = this.adapter.subscribe((newState) => {
      this.handleStateTransition(newState);
    });
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public getState(): AppLifecycleState {
    return this.currentState;
  }

  public onStateChange(listener: LifecycleListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public onPauseRequired(hook: () => void): () => void {
    this.pauseHooks.add(hook);
    return () => this.pauseHooks.delete(hook);
  }

  public onResumeAllowed(hook: () => void): () => void {
    this.resumeHooks.add(hook);
    return () => this.resumeHooks.delete(hook);
  }

  public notifyGameRunning(isRunning: boolean): void {
    this.wasRunningBeforeBackground = isRunning;
  }

  public dispose(): void {
    this._isDisposed = true;
    if (this.unsubscribeAdapter) {
      this.unsubscribeAdapter();
    }
    this.listeners.clear();
    this.pauseHooks.clear();
    this.resumeHooks.clear();
  }

  private handleStateTransition(nextState: AppLifecycleState): void {
    if (this._isDisposed || this.currentState === nextState) return;

    const previousState = this.currentState;
    this.currentState = nextState;

    if (nextState === 'background' || nextState === 'inactive') {
      if (this.autoPauseOnBackground) {
        for (const hook of this.pauseHooks) hook();
      }
    } else if (nextState === 'active' && (previousState === 'background' || previousState === 'inactive')) {
      if (this.resumePolicy === 'auto_resume' && this.wasRunningBeforeBackground) {
        for (const hook of this.resumeHooks) hook();
      }
    }

    for (const listener of this.listeners) {
      listener(nextState);
    }
  }
}
