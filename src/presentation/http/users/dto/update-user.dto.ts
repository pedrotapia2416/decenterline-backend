import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'strong-password' })
  password?: string;

  @ApiPropertyOptional({ example: ['admin'] })
  roles?: string[];

  @ApiPropertyOptional({ example: true })
  active?: boolean;
}
