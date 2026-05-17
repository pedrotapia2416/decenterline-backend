import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ROLE_REPOSITORY_PORT, RoleRepositoryPort } from '../ports/role-repository.port';

@Injectable()
export class DeleteRoleUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY_PORT)
    private readonly roleRepository: RoleRepositoryPort,
  ) {}

  async execute(name: string): Promise<void> {
    const deleted = await this.roleRepository.delete(name);
    if (!deleted) {
      throw new NotFoundException('Role not found');
    }
  }
}
