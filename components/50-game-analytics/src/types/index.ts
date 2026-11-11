export interface AnalyticsEvent {
  eventName: string;
  timestamp: number;
  properties?: Record<string, string | number | boolean>;
}

export interface IAnalyticsProvider {
  trackEvent(event: AnalyticsEvent): Promise<void> | void;
  flush?(events: AnalyticsEvent[]): Promise<void> | void;
}

export interface AnalyticsConfig {
  batchSize?: number; // default 20
  provider?: IAnalyticsProvider;
}

