import { Module } from '@nestjs/common';
import { AuthModule } from './presentation/http/auth/auth.module';
import { HealthModule } from './presentation/http/health/health.module';
import { IndustriesModule } from './presentation/http/industries/industries.module';
import { RolesModule } from './presentation/http/roles/roles.module';
import { UsersModule } from './presentation/http/users/users.module';

@Module({
  imports: [HealthModule, AuthModule, UsersModule, RolesModule, IndustriesModule],
})
export class AppModule {}
