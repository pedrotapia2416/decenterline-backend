import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PASSWORD_HASHER_PORT, PasswordHasherPort } from '../ports/password-hasher.port';
import { USER_REPOSITORY_PORT, UserRepositoryPort } from '../ports/user-repository.port';
import { UserAccount } from '../../domain/user/user.model';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
    @Inject(PASSWORD_HASHER_PORT)
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  async execute(input: {
    username: string;
    password?: string;
    roles?: string[];
    active?: boolean;
  }): Promise<UserAccount> {
    const patch: Partial<Pick<UserAccount, 'passwordHash' | 'roles' | 'active'>> = {};

    if (typeof input.password === 'string') {
      patch.passwordHash = this.passwordHasher.hash(input.password);
    }

    if (input.roles) {
      patch.roles = input.roles;
    }

    if (typeof input.active === 'boolean') {
      patch.active = input.active;
    }

    const updated = await this.userRepository.update(input.username, patch);
    if (!updated) {
      throw new NotFoundException('User not found');
    }

    return updated;
  }
}
