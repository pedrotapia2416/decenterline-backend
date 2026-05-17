import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserUseCase } from '../../../application/use-cases/create-user.use-case';
import { DeleteUserUseCase } from '../../../application/use-cases/delete-user.use-case';
import { GetCurrentUserUseCase } from '../../../application/use-cases/get-current-user.use-case';
import { ListUsersUseCase } from '../../../application/use-cases/list-users.use-case';
import { UpdateUserUseCase } from '../../../application/use-cases/update-user.use-case';
import { CurrentUser } from '../auth/current-user.decorator';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth('access-token')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
  ) {}

  @Get('me')
  @ApiOkResponse({ type: UserResponseDto })
  async me(@CurrentUser() user: { username: string }): Promise<UserResponseDto> {
    return mapUser(await this.getCurrentUserUseCase.execute(user.username));
  }

  @Get()
  @Roles('admin')
  @ApiOkResponse({ type: UserResponseDto, isArray: true })
  async list(): Promise<UserResponseDto[]> {
    return (await this.listUsersUseCase.execute()).map(mapUser);
  }

  @Post()
  @Roles('admin')
  @ApiBody({ type: CreateUserDto })
  @ApiOkResponse({ type: UserResponseDto })
  async create(@Body() body: CreateUserDto): Promise<UserResponseDto> {
    const created = await this.createUserUseCase.execute(body);
    return mapUser(created);
  }

  @Patch(':username')
  @Roles('admin')
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ type: UserResponseDto })
  async update(@Param('username') username: string, @Body() body: UpdateUserDto): Promise<UserResponseDto> {
    return mapUser(await this.updateUserUseCase.execute({ username, ...body }));
  }

  @Delete(':username')
  @Roles('admin')
  @ApiOkResponse({ description: 'User deleted' })
  async remove(@Param('username') username: string): Promise<{ deleted: boolean }> {
    await this.deleteUserUseCase.execute(username);
    return { deleted: true };
  }
}

function mapUser(user: {
  username: string;
  roles: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}): UserResponseDto {
  return {
    username: user.username,
    roles: user.roles,
    active: user.active,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
