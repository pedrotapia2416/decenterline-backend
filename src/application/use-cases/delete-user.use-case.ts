import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY_PORT, UserRepositoryPort } from '../ports/user-repository.port';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(username: string): Promise<void> {
    const deleted = await this.userRepository.delete(username);
    if (!deleted) {
      throw new NotFoundException('User not found');
    }
  }
}
