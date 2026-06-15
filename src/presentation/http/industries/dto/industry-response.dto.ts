import { ApiProperty } from '@nestjs/swagger';

export class IndustryResponseDto {
  @ApiProperty({ example: 'mineria' })
  slug!: string;

  @ApiProperty({ example: 'Mineria' })
  name!: string;

  @ApiProperty({ example: 'Tier 1' })
  tier!: string;

  @ApiProperty({ example: 'Operaciones intensivas en seguridad, contratistas y documentacion.' })
  summary!: string;

  @ApiProperty({ example: 'Digitalizamos procesos criticos para operaciones industriales complejas.' })
  description!: string;

  @ApiProperty({ example: '/media/use-cases/operations-management.jpg' })
  imageUrl!: string;

  @ApiProperty({ example: ['Contratistas', 'Seguridad', 'Auditorias'] })
  problems!: string[];

  @ApiProperty({ example: ['Control de contratistas', 'Permisos de trabajo'] })
  products!: string[];

  @ApiProperty({ example: true })
  active!: boolean;

  @ApiProperty({ example: 10 })
  order!: number;

  @ApiProperty({ example: '2026-06-14T20:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-06-14T20:00:00.000Z' })
  updatedAt!: string;
}
