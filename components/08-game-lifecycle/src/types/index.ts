export type AppLifecycleState = 'active' | 'background' | 'inactive';

export type ResumePolicy = 'auto_resume' | 'remain_paused' | 'show_pause_menu';

export interface GameLifecycleConfig {
  resumePolicy?: ResumePolicy;
  autoPauseOnBackground?: boolean;
}

export interface ILifecyclePlatformAdapter {
  getCurrentState(): AppLifecycleState;
  subscribe(listener: (state: AppLifecycleState) => void): () => void;
}

export type LifecycleListener = (state: AppLifecycleState) => void;
