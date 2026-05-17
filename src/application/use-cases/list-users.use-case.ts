import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY_PORT, UserRepositoryPort } from '../ports/user-repository.port';
import { UserAccount } from '../../domain/user/user.model';

@Injectable()
export class ListUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  execute(): Promise<UserAccount[]> {
    return this.userRepository.findAll();
  }
}
