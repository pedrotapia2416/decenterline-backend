import { ApiProperty } from '@nestjs/swagger';

export class CurrentUserResponseDto {
  @ApiProperty({ example: 'admin' })
  username!: string;

  @ApiProperty({ example: ['user'] })
  roles!: string[];
}
