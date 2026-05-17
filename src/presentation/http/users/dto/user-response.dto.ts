import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 'jane' })
  username!: string;

  @ApiProperty({ example: ['user'] })
  roles!: string[];

  @ApiProperty({ example: true })
  active!: boolean;

  @ApiProperty({ example: '2026-05-16T23:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-05-16T23:00:00.000Z' })
  updatedAt!: string;
}
