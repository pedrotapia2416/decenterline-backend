import { Inject, Injectable } from '@nestjs/common';
import { AUTH_CONFIG_PORT, AuthConfigPort } from '../ports/auth-config.port';
import {
  CREDENTIAL_STORE_PORT,
  CredentialStorePort,
} from '../ports/credential-store.port';
import { TOKEN_SERVICE_PORT, TokenServicePort } from '../ports/token-service.port';
import { AuthSession } from '../../domain/auth/auth.model';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(CREDENTIAL_STORE_PORT)
    private readonly credentialStore: CredentialStorePort,
    @Inject(TOKEN_SERVICE_PORT)
    private readonly tokenService: TokenServicePort,
    @Inject(AUTH_CONFIG_PORT)
    private readonly authConfig: AuthConfigPort,
  ) {}

  async execute(input: { username: string; password: string }): Promise<AuthSession | null> {
    const principal = await this.credentialStore.validate(input.username, input.password);

    if (!principal) {
      return null;
    }

    const accessToken = this.tokenService.sign(principal);
    const expiresInSeconds = this.authConfig.getTokenTtlSeconds();
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000).toISOString();

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresAt,
      expiresInSeconds,
      user: principal,
    };
  }
}
