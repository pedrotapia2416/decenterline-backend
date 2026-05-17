import { Role } from '../../domain/role/role.model';

export const ROLE_REPOSITORY_PORT = Symbol('ROLE_REPOSITORY_PORT');

export interface RoleRepositoryPort {
  findByName(name: string): Promise<Role | null>;
  findAll(): Promise<Role[]>;
  create(role: Role): Promise<void>;
  update(
    name: string,
    patch: Partial<Pick<Role, 'description' | 'permissions'>>,
  ): Promise<Role | null>;
  delete(name: string): Promise<boolean>;
  ensureRole(role: Role): Promise<void>;
}
