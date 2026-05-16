import { Module } from '@nestjs/common';
import { HEALTH_CHECK_PORT } from '../../../application/ports/health-check.port';
import { GetHealthUseCase } from '../../../application/use-cases/get-health.use-case';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
  providers: [
    {
      provide: HEALTH_CHECK_PORT,
      useClass: GetHealthUseCase,
    },
  ],
})
export class HealthModule {}
