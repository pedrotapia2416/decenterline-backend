import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({ example: 'ok' })
  status!: 'ok';

  @ApiProperty({ example: 'decenterline-backend' })
  service!: string;

  @ApiProperty({ example: '2026-05-16T12:00:00.000Z' })
  timestamp!: string;
}
