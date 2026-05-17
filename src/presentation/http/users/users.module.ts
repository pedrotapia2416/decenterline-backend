import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersController } from './users.controller';
import { CreateUserUseCase } from '../../../application/use-cases/create-user.use-case';
import { DeleteUserUseCase } from '../../../application/use-cases/delete-user.use-case';
import { GetCurrentUserUseCase } from '../../../application/use-cases/get-current-user.use-case';
import { ListUsersUseCase } from '../../../application/use-cases/list-users.use-case';
import { UpdateUserUseCase } from '../../../application/use-cases/update-user.use-case';
import { RolesGuard } from '../auth/roles.guard';

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [GetCurrentUserUseCase, ListUsersUseCase, CreateUserUseCase, UpdateUserUseCase, DeleteUserUseCase, RolesGuard],
})
export class UsersModule {}
