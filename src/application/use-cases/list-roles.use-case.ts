import { Inject, Injectable } from '@nestjs/common';
import { ROLE_REPOSITORY_PORT, RoleRepositoryPort } from '../ports/role-repository.port';
import { Role } from '../../domain/role/role.model';

@Injectable()
export class ListRolesUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY_PORT)
    private readonly roleRepository: RoleRepositoryPort,
  ) {}

  execute(): Promise<Role[]> {
    return this.roleRepository.findAll();
  }
}
