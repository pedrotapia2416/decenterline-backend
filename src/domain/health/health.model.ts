export type HealthState = 'ok';

export interface HealthSnapshot {
  status: HealthState;
  service: string;
  timestamp: string;
}
