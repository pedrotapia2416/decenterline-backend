import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AUTH_CONFIG_PORT } from '../../../application/ports/auth-config.port';
import { CREDENTIAL_STORE_PORT } from '../../../application/ports/credential-store.port';
import { TOKEN_SERVICE_PORT } from '../../../application/ports/token-service.port';
import { LoginUseCase } from '../../../application/use-cases/login.use-case';
import { EnvAuthConfigService } from '../../../infrastructure/auth/env-auth-config.service';
import { EnvCredentialStoreService } from '../../../infrastructure/auth/env-credential-store.service';
import { HmacTokenService } from '../../../infrastructure/auth/hmac-token.service';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    JwtAuthGuard,
    {
      provide: AUTH_CONFIG_PORT,
      useClass: EnvAuthConfigService,
    },
    {
      provide: CREDENTIAL_STORE_PORT,
      useClass: EnvCredentialStoreService,
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
  exports: [AUTH_CONFIG_PORT, TOKEN_SERVICE_PORT],
})
export class AuthModule {}
