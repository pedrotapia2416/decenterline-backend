import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ROLE_REPOSITORY_PORT, RoleRepositoryPort } from '../ports/role-repository.port';
import { Role } from '../../domain/role/role.model';

@Injectable()
export class UpdateRoleUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY_PORT)
    private readonly roleRepository: RoleRepositoryPort,
  ) {}

  async execute(input: { name: string; description?: string; permissions?: string[] }): Promise<Role> {
    const updated = await this.roleRepository.update(input.name, {
      description: input.description,
      permissions: input.permissions,
    });

    if (!updated) {
      throw new NotFoundException('Role not found');
    }

    return updated;
  }
}
