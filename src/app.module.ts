import { Module } from '@nestjs/common';
import { AuthModule } from './presentation/http/auth/auth.module';
import { HealthModule } from './presentation/http/health/health.module';

@Module({
  imports: [HealthModule, AuthModule],
})
export class AppModule {}
