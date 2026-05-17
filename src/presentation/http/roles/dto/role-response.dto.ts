import { ApiProperty } from '@nestjs/swagger';

export class RoleResponseDto {
  @ApiProperty({ example: 'manager' })
  name!: string;

  @ApiProperty({ example: 'Manager role', required: false })
  description?: string;

  @ApiProperty({ example: ['users:read', 'users:update'] })
  permissions!: string[];

  @ApiProperty({ example: '2026-05-16T23:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-05-16T23:00:00.000Z' })
  updatedAt!: string;
}
