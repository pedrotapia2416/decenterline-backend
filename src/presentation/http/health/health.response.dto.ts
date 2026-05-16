import { ApiProperty } from '@nestjs/swagger';
import { HealthSnapshot } from '../../../domain/health/health.model';

export class HealthResponseDto implements HealthSnapshot {
  @ApiProperty({ example: 'ok' })
  status!: 'ok';

  @ApiProperty({ example: 'decenterline-backend' })
  service!: string;

  @ApiProperty({ example: '2026-05-16T12:00:00.000Z' })
  timestamp!: string;
}
