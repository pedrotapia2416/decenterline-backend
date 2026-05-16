import { Injectable } from '@nestjs/common';
import { CredentialStorePort } from '../../application/ports/credential-store.port';
import { MongoUserRepository } from '../mongo/mongo-user.repository';
import { ScryptPasswordHasherService } from '../mongo/scrypt-password-hasher.service';
import { AuthPrincipal } from '../../domain/auth/auth.model';

@Injectable()
export class MongoCredentialStoreService implements CredentialStorePort {
  constructor(
    private readonly userRepository: MongoUserRepository,
    private readonly passwordHasher: ScryptPasswordHasherService,
  ) {}

  async validate(username: string, password: string): Promise<AuthPrincipal | null> {
    const user = await this.userRepository.findByUsername(username);

    if (!user || !user.active) {
      return null;
    }

    const validPassword = this.passwordHasher.verify(password, user.passwordHash);
    if (!validPassword) {
      return null;
    }

    return {
      username: user.username,
      roles: user.roles,
    };
  }
}
