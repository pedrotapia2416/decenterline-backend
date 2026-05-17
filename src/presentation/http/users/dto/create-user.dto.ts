import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'jane' })
  username!: string;

  @ApiProperty({ example: 'strong-password' })
  password!: string;

  @ApiProperty({ example: ['user'] })
  roles!: string[];

  @ApiProperty({ example: true, required: false })
  active?: boolean;
}
