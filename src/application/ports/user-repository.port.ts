import { UserAccount } from '../../domain/user/user.model';

export const USER_REPOSITORY_PORT = Symbol('USER_REPOSITORY_PORT');

export interface UserRepositoryPort {
  findByUsername(username: string): Promise<UserAccount | null>;
  findAll(): Promise<UserAccount[]>;
  create(user: UserAccount): Promise<void>;
  update(
    username: string,
    patch: Partial<Pick<UserAccount, 'passwordHash' | 'roles' | 'active'>>,
  ): Promise<UserAccount | null>;
  delete(username: string): Promise<boolean>;
  ensureUser(user: UserAccount): Promise<void>;
}
