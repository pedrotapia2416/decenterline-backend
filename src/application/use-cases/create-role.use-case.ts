import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { ROLE_REPOSITORY_PORT, RoleRepositoryPort } from '../ports/role-repository.port';
import { Role } from '../../domain/role/role.model';

@Injectable()
export class CreateRoleUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY_PORT)
    private readonly roleRepository: RoleRepositoryPort,
  ) {}

  async execute(input: { name: string; description?: string; permissions?: string[] }): Promise<Role> {
    const existing = await this.roleRepository.findByName(input.name);
    if (existing) {
      throw new ConflictException('Role already exists');
    }

    const now = new Date().toISOString();
    const role: Role = {
      name: input.name,
      description: input.description,
      permissions: input.permissions ?? [],
      createdAt: now,
      updatedAt: now,
    };

    await this.roleRepository.create(role);
    return role;
  }
}
