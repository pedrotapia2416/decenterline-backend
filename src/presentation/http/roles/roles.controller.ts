import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateRoleUseCase } from '../../../application/use-cases/create-role.use-case';
import { DeleteRoleUseCase } from '../../../application/use-cases/delete-role.use-case';
import { ListRolesUseCase } from '../../../application/use-cases/list-roles.use-case';
import { UpdateRoleUseCase } from '../../../application/use-cases/update-role.use-case';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleResponseDto } from './dto/role-response.dto';

@ApiTags('roles')
@Controller('roles')
@ApiBearerAuth('access-token')
@UseGuards(RolesGuard)
@Roles('admin')
export class RolesController {
  constructor(
    private readonly listRolesUseCase: ListRolesUseCase,
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly updateRoleUseCase: UpdateRoleUseCase,
    private readonly deleteRoleUseCase: DeleteRoleUseCase,
  ) {}

  @Get()
  @ApiOkResponse({ type: RoleResponseDto, isArray: true })
  async list(): Promise<RoleResponseDto[]> {
    return (await this.listRolesUseCase.execute()).map(mapRole);
  }

  @Post()
  @ApiBody({ type: CreateRoleDto })
  @ApiOkResponse({ type: RoleResponseDto })
  async create(@Body() body: CreateRoleDto): Promise<RoleResponseDto> {
    return mapRole(await this.createRoleUseCase.execute(body));
  }

  @Patch(':name')
  @ApiBody({ type: UpdateRoleDto })
  @ApiOkResponse({ type: RoleResponseDto })
  async update(@Param('name') name: string, @Body() body: UpdateRoleDto): Promise<RoleResponseDto> {
    return mapRole(await this.updateRoleUseCase.execute({ name, ...body }));
  }

  @Delete(':name')
  @ApiOkResponse({ description: 'Role deleted' })
  async remove(@Param('name') name: string): Promise<{ deleted: boolean }> {
    await this.deleteRoleUseCase.execute(name);
    return { deleted: true };
  }
}

function mapRole(role: {
  name: string;
  description?: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}): RoleResponseDto {
  return {
    name: role.name,
    description: role.description,
    permissions: role.permissions,
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
  };
}
