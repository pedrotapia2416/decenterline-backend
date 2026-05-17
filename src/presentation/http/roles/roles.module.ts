import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { RolesController } from './roles.controller';
import { CreateRoleUseCase } from '../../../application/use-cases/create-role.use-case';
import { DeleteRoleUseCase } from '../../../application/use-cases/delete-role.use-case';
import { ListRolesUseCase } from '../../../application/use-cases/list-roles.use-case';
import { UpdateRoleUseCase } from '../../../application/use-cases/update-role.use-case';
import { RolesGuard } from '../auth/roles.guard';

@Module({
  imports: [AuthModule],
  controllers: [RolesController],
  providers: [ListRolesUseCase, CreateRoleUseCase, UpdateRoleUseCase, DeleteRoleUseCase, RolesGuard],
})
export class RolesModule {}
