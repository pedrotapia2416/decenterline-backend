import { HealthSnapshot } from '../../domain/health/health.model';

export const HEALTH_CHECK_PORT = Symbol('HEALTH_CHECK_PORT');

export interface HealthCheckPort {
  execute(): Promise<HealthSnapshot> | HealthSnapshot;
}
