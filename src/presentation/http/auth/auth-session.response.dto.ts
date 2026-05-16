import { ApiProperty } from '@nestjs/swagger';

export class AuthSessionResponseDto {
  @ApiProperty({ example: 'Bearer' })
  tokenType!: 'Bearer';

  @ApiProperty({
    example: 'eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZXMiOlsidXNlciJdLCJpYXQiOjE3MTU4ODAwMDAsImV4cCI6MTcxNTg4MzYwMH0.ABC123',
  })
  accessToken!: string;

  @ApiProperty({ example: '2026-05-16T19:00:00.000Z' })
  expiresAt!: string;

  @ApiProperty({ example: 3600 })
  expiresInSeconds!: number;

  @ApiProperty({
    example: {
      username: 'admin',
      roles: ['user'],
    },
  })
  user!: {
    username: string;
    roles: string[];
  };
}
