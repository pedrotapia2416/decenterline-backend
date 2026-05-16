import { Injectable } from '@nestjs/common';
import { HealthCheckPort } from '../ports/health-check.port';
import { HealthSnapshot } from '../../domain/health/health.model';

@Injectable()
export class GetHealthUseCase implements HealthCheckPort {
  execute(): HealthSnapshot {
    return {
      status: 'ok',
      service: 'decenterline-backend',
      timestamp: new Date().toISOString(),
    };
  }
}
