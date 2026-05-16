import { Inject, Injectable } from '@nestjs/common';
import { AuthPrincipal } from '../../domain/auth/auth.model';
import { AuthConfigPort } from '../../application/ports/auth-config.port';
import { AUTH_CONFIG_PORT } from '../../application/ports/auth-config.port';
import { CredentialStorePort } from '../../application/ports/credential-store.port';

@Injectable()
export class EnvCredentialStoreService implements CredentialStorePort {
  constructor(
    @Inject(AUTH_CONFIG_PORT)
    private readonly authConfig: AuthConfigPort,
  ) {}

  validate(username: string, password: string): AuthPrincipal | null {
    const configuredUsername = this.authConfig.getUsername();
    const configuredPassword = this.authConfig.getPassword();

    if (username !== configuredUsername || password !== configuredPassword) {
      return null;
    }

    return {
      username: configuredUsername,
      roles: ['user'],
    };
  }
}
