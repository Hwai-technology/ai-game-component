export class GameError extends Error {
  public readonly code: string;
  public readonly details?: Record<string, unknown>;

  constructor(message: string, code = 'GAME_ERROR', details?: Record<string, unknown>) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends GameError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', details);
  }
}

export class StateTransitionError extends GameError {
  constructor(fromState: string, toState: string, reason?: string) {
    super(
      `Invalid state transition from '${fromState}' to '${toState}'${reason ? `: ${reason}` : ''}`,
      'STATE_TRANSITION_ERROR',
      { fromState, toState, reason }
    );
  }
}

export class ConfigurationError extends GameError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'CONFIGURATION_ERROR', details);
  }
}

export class LifecycleError extends GameError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'LIFECYCLE_ERROR', details);
  }
}

export class EntityNotFoundError extends GameError {
  constructor(entityType: string, id: string | number) {
    super(`${entityType} with ID '${id}' not found`, 'ENTITY_NOT_FOUND', { entityType, id });
  }
}

