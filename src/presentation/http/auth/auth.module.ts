import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AUTH_CONFIG_PORT } from '../../../application/ports/auth-config.port';
import { CREDENTIAL_STORE_PORT } from '../../../application/ports/credential-store.port';
import { TOKEN_SERVICE_PORT } from '../../../application/ports/token-service.port';
import { LoginUseCase } from '../../../application/use-cases/login.use-case';
import { MongoCredentialStoreService } from '../../../infrastructure/auth/mongo-credential-store.service';
import { EnvTokenConfigService } from '../../../infrastructure/auth/env-token-config.service';
import { HmacTokenService } from '../../../infrastructure/auth/hmac-token.service';
import { MongoModule } from '../../../infrastructure/mongo/mongo.module';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [MongoModule],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    JwtAuthGuard,
    {
      provide: AUTH_CONFIG_PORT,
      useClass: EnvTokenConfigService,
    },
    {
      provide: CREDENTIAL_STORE_PORT,
      useClass: MongoCredentialStoreService,
    },
    {
      provide: TOKEN_SERVICE_PORT,
      useClass: HmacTokenService,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [AUTH_CONFIG_PORT, TOKEN_SERVICE_PORT, CREDENTIAL_STORE_PORT],
})
export class AuthModule {}
