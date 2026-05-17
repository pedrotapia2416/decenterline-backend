import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { AUTH_CONFIG_PORT, AuthConfigPort } from '../ports/auth-config.port';
import { PASSWORD_HASHER_PORT, PasswordHasherPort } from '../ports/password-hasher.port';
import { TOKEN_SERVICE_PORT, TokenServicePort } from '../ports/token-service.port';
import { USER_REPOSITORY_PORT, UserRepositoryPort } from '../ports/user-repository.port';
import { AuthPrincipal, AuthSession } from '../../domain/auth/auth.model';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
    @Inject(PASSWORD_HASHER_PORT)
    private readonly passwordHasher: PasswordHasherPort,
    @Inject(TOKEN_SERVICE_PORT)
    private readonly tokenService: TokenServicePort,
    @Inject(AUTH_CONFIG_PORT)
    private readonly authConfig: AuthConfigPort,
  ) {}

  async execute(input: { username: string; password: string }): Promise<AuthSession> {
    const existing = await this.userRepository.findByUsername(input.username);
    if (existing) {
      throw new ConflictException('User already exists');
    }

    const now = new Date().toISOString();
    const user = {
      username: input.username,
      passwordHash: this.passwordHasher.hash(input.password),
      roles: ['user'],
      active: true,
      createdAt: now,
      updatedAt: now,
    };

    await this.userRepository.create(user);

    const principal: AuthPrincipal = {
      username: user.username,
      roles: user.roles,
    };

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
