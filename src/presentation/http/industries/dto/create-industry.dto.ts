import { ApiProperty } from '@nestjs/swagger';

export class CreateIndustryDto {
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
}
