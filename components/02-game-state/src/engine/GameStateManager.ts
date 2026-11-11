import { StateTransitionError } from '../../../../core/error-system/src/index.js';
import { Disposable } from '../../../../core/shared-types/src/index.js';
import {
  GameStateConfig,
  StandardGameState,
  StateChangeEvent,
  StateListener,
  StateTransition,
} from '../types/index.js';

export class GameStateManager<S extends string = StandardGameState> implements Disposable {
  private currentState: S;
  private readonly transitions = new Map<S, Map<S, ((context?: unknown) => boolean) | undefined>>();
  private readonly listeners = new Set<StateListener<S>>();
  private readonly enterHooks = new Map<S, Set<(event: StateChangeEvent<S>) => void>>();
  private readonly exitHooks = new Map<S, Set<(event: StateChangeEvent<S>) => void>>();
  private readonly history: S[] = [];
  private readonly maxHistoryLength: number;
  private _isDisposed = false;

  constructor(config: GameStateConfig<S>) {
    this.currentState = config.initialState;
    this.maxHistoryLength = config.maxHistoryLength ?? 50;
    this.history.push(this.currentState);

    if (config.transitions) {
      for (const t of config.transitions) {
        this.addTransition(t);
      }
    }
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public addTransition(transition: StateTransition<S>): void {
    const fromList = Array.isArray(transition.from) ? transition.from : [transition.from];

    for (const from of fromList) {
      if (!this.transitions.has(from)) {
        this.transitions.set(from, new Map());
      }
      this.transitions.get(from)!.set(transition.to, transition.guard);
    }
  }

  public canTransitionTo(targetState: S, context?: unknown): boolean {
    if (this._isDisposed || this.currentState === targetState) return false;

    // If no explicit transitions are registered in the entire FSM, allow all
    if (this.transitions.size === 0) return true;

    const allowed = this.transitions.get(this.currentState);
    if (!allowed || !allowed.has(targetState)) return false;

    const guard = allowed.get(targetState);
    if (guard) {
      return guard(context);
    }
    return true;
  }

  public transitionTo(targetState: S, payload?: unknown): boolean {
    if (this._isDisposed) return false;
    if (this.currentState === targetState) return true;

    if (!this.canTransitionTo(targetState, payload)) {
      throw new StateTransitionError(this.currentState, targetState, 'Transition guard failed or transition not allowed');
    }

    const previousState = this.currentState;
    const event: StateChangeEvent<S> = {
      previousState,
      currentState: targetState,
      timestamp: Date.now(),
      payload,
    };

    // Trigger exit hooks
    const exitSet = this.exitHooks.get(previousState);
    if (exitSet) {
      for (const hook of exitSet) hook(event);
    }

    // Mutate state
    this.currentState = targetState;
    this.history.push(targetState);
    if (this.history.length > this.maxHistoryLength) {
      this.history.shift();
    }

    // Trigger enter hooks
    const enterSet = this.enterHooks.get(targetState);
    if (enterSet) {
      for (const hook of enterSet) hook(event);
    }

    // Notify listeners
    for (const listener of this.listeners) {
      listener(event);
    }

    return true;
  }

  public getState(): S {
    return this.currentState;
  }

  public is(state: S): boolean {
    return this.currentState === state;
  }

  public getHistory(): readonly S[] {
    return [...this.history];
  }

  public onStateChange(listener: StateListener<S>): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public onEnter(state: S, hook: (event: StateChangeEvent<S>) => void): () => void {
    if (!this.enterHooks.has(state)) {
      this.enterHooks.set(state, new Set());
    }
    this.enterHooks.get(state)!.add(hook);
    return () => this.enterHooks.get(state)?.delete(hook);
  }

  public onExit(state: S, hook: (event: StateChangeEvent<S>) => void): () => void {
    if (!this.exitHooks.has(state)) {
      this.exitHooks.set(state, new Set());
    }
    this.exitHooks.get(state)!.add(hook);
    return () => this.exitHooks.get(state)?.delete(hook);
  }

  public reset(initialState: S): void {
    this.currentState = initialState;
    this.history.length = 0;
    this.history.push(initialState);
  }

  public dispose(): void {
    this._isDisposed = true;
    this.listeners.clear();
    this.enterHooks.clear();
    this.exitHooks.clear();
  }
}
