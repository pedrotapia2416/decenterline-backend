import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'manager' })
  name!: string;

  @ApiProperty({ example: 'Manager role', required: false })
  description?: string;

  @ApiProperty({ example: ['users:read', 'users:update'], required: false })
  permissions?: string[];
}
