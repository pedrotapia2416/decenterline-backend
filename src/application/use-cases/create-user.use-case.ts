import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { PASSWORD_HASHER_PORT, PasswordHasherPort } from '../ports/password-hasher.port';
import { USER_REPOSITORY_PORT, UserRepositoryPort } from '../ports/user-repository.port';
import { UserAccount } from '../../domain/user/user.model';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
    @Inject(PASSWORD_HASHER_PORT)
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  async execute(input: {
    username: string;
    password: string;
    roles: string[];
    active?: boolean;
  }): Promise<UserAccount> {
    const existing = await this.userRepository.findByUsername(input.username);
    if (existing) {
      throw new ConflictException('User already exists');
    }

    const now = new Date().toISOString();
    const user: UserAccount = {
      username: input.username,
      passwordHash: this.passwordHasher.hash(input.password),
      roles: input.roles,
      active: input.active ?? true,
      createdAt: now,
      updatedAt: now,
    };

    await this.userRepository.create(user);
    return user;
  }
}
