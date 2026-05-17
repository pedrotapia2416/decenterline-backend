import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRoleDto {
  @ApiPropertyOptional({ example: 'Manager role' })
  description?: string;

  @ApiPropertyOptional({ example: ['users:read', 'users:update'] })
  permissions?: string[];
}
