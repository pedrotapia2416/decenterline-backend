import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateIndustryDto {
  @ApiPropertyOptional({ example: 'Mineria' })
  name?: string;

  @ApiPropertyOptional({ example: 'Tier 1' })
  tier?: string;

  @ApiPropertyOptional({ example: 'Operaciones intensivas en seguridad, contratistas y documentacion.' })
  summary?: string;

  @ApiPropertyOptional({ example: 'Digitalizamos procesos criticos para operaciones industriales complejas.' })
  description?: string;

  @ApiPropertyOptional({ example: '/media/use-cases/operations-management.jpg' })
  imageUrl?: string;

  @ApiPropertyOptional({ example: ['Contratistas', 'Seguridad', 'Auditorias'] })
  problems?: string[];

  @ApiPropertyOptional({ example: ['Control de contratistas', 'Permisos de trabajo'] })
  products?: string[];

  @ApiPropertyOptional({ example: true })
  active?: boolean;

  @ApiPropertyOptional({ example: 10 })
  order?: number;
}
