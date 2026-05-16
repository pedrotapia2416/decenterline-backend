import { UserAccount } from '../../domain/user/user.model';

export const USER_REPOSITORY_PORT = Symbol('USER_REPOSITORY_PORT');

export interface UserRepositoryPort {
  findByUsername(username: string): Promise<UserAccount | null>;
  ensureUser(user: UserAccount): Promise<void>;
}
