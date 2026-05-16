import { Role } from '../../domain/role/role.model';

export const ROLE_REPOSITORY_PORT = Symbol('ROLE_REPOSITORY_PORT');

export interface RoleRepositoryPort {
  findByName(name: string): Promise<Role | null>;
  ensureRole(role: Role): Promise<void>;
}
