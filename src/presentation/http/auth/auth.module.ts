import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AUTH_CONFIG_PORT } from '../../../application/ports/auth-config.port';
import { CREDENTIAL_STORE_PORT } from '../../../application/ports/credential-store.port';
import { PASSWORD_HASHER_PORT } from '../../../application/ports/password-hasher.port';
import { ROLE_REPOSITORY_PORT } from '../../../application/ports/role-repository.port';
import { TOKEN_SERVICE_PORT } from '../../../application/ports/token-service.port';
import { USER_REPOSITORY_PORT } from '../../../application/ports/user-repository.port';
import { LoginUseCase } from '../../../application/use-cases/login.use-case';
import { RegisterUserUseCase } from '../../../application/use-cases/register-user.use-case';
import { MongoCredentialStoreService } from '../../../infrastructure/auth/mongo-credential-store.service';
import { EnvTokenConfigService } from '../../../infrastructure/auth/env-token-config.service';
import { HmacTokenService } from '../../../infrastructure/auth/hmac-token.service';
import { MongoModule } from '../../../infrastructure/mongo/mongo.module';
import { MongoRoleRepository } from '../../../infrastructure/mongo/mongo-role.repository';
import { MongoUserRepository } from '../../../infrastructure/mongo/mongo-user.repository';
import { ScryptPasswordHasherService } from '../../../infrastructure/mongo/scrypt-password-hasher.service';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [MongoModule],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    RegisterUserUseCase,
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
      provide: USER_REPOSITORY_PORT,
      useExisting: MongoUserRepository,
    },
    {
      provide: ROLE_REPOSITORY_PORT,
      useExisting: MongoRoleRepository,
    },
    {
      provide: PASSWORD_HASHER_PORT,
      useExisting: ScryptPasswordHasherService,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [
    AUTH_CONFIG_PORT,
    TOKEN_SERVICE_PORT,
    CREDENTIAL_STORE_PORT,
    USER_REPOSITORY_PORT,
    ROLE_REPOSITORY_PORT,
    PASSWORD_HASHER_PORT,
  ],
})
export class AuthModule {}
