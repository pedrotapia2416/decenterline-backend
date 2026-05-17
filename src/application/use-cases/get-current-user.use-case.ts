import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY_PORT, UserRepositoryPort } from '../ports/user-repository.port';
import { UserAccount } from '../../domain/user/user.model';

@Injectable()
export class GetCurrentUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(username: string): Promise<UserAccount> {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
