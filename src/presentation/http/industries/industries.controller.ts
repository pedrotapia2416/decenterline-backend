import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateIndustryUseCase } from '../../../application/use-cases/create-industry.use-case';
import { DeleteIndustryUseCase } from '../../../application/use-cases/delete-industry.use-case';
import { GetIndustryUseCase } from '../../../application/use-cases/get-industry.use-case';
import { ListIndustriesUseCase } from '../../../application/use-cases/list-industries.use-case';
import { UpdateIndustryUseCase } from '../../../application/use-cases/update-industry.use-case';
import { Industry } from '../../../domain/industry/industry.model';
import { Public } from '../auth/public.decorator';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { IndustryResponseDto } from './dto/industry-response.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';

@ApiTags('industries')
@Controller('industries')
export class IndustriesController {
  constructor(
    private readonly listIndustriesUseCase: ListIndustriesUseCase,
    private readonly getIndustryUseCase: GetIndustryUseCase,
    private readonly createIndustryUseCase: CreateIndustryUseCase,
    private readonly updateIndustryUseCase: UpdateIndustryUseCase,
    private readonly deleteIndustryUseCase: DeleteIndustryUseCase,
  ) {}

  @Public()
  @Get()
  @ApiOkResponse({ type: IndustryResponseDto, isArray: true })
  async list(): Promise<IndustryResponseDto[]> {
    return (await this.listIndustriesUseCase.execute()).map(mapIndustry);
  }

  @Get('admin/all')
  @ApiBearerAuth('access-token')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOkResponse({ type: IndustryResponseDto, isArray: true })
  async listAll(): Promise<IndustryResponseDto[]> {
    return (await this.listIndustriesUseCase.execute({ includeInactive: true })).map(mapIndustry);
  }

  @Public()
  @Get(':slug')
  @ApiOkResponse({ type: IndustryResponseDto })
  async get(@Param('slug') slug: string): Promise<IndustryResponseDto> {
    return mapIndustry(await this.getIndustryUseCase.execute(slug));
  }

  @Post()
  @ApiBearerAuth('access-token')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiBody({ type: CreateIndustryDto })
  @ApiOkResponse({ type: IndustryResponseDto })
  async create(@Body() body: CreateIndustryDto): Promise<IndustryResponseDto> {
    return mapIndustry(await this.createIndustryUseCase.execute(body));
  }

  @Patch(':slug')
  @ApiBearerAuth('access-token')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiBody({ type: UpdateIndustryDto })
  @ApiOkResponse({ type: IndustryResponseDto })
  async update(@Param('slug') slug: string, @Body() body: UpdateIndustryDto): Promise<IndustryResponseDto> {
    return mapIndustry(await this.updateIndustryUseCase.execute(slug, body));
  }

  @Delete(':slug')
  @ApiBearerAuth('access-token')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOkResponse({ description: 'Industry deleted' })
  async remove(@Param('slug') slug: string): Promise<{ deleted: boolean }> {
    await this.deleteIndustryUseCase.execute(slug);
    return { deleted: true };
  }
}

function mapIndustry(industry: Industry): IndustryResponseDto {
  return {
    slug: industry.slug,
    name: industry.name,
    tier: industry.tier,
    summary: industry.summary,
    description: industry.description,
    imageUrl: industry.imageUrl,
    problems: industry.problems,
    products: industry.products,
    active: industry.active,
    order: industry.order,
    createdAt: industry.createdAt,
    updatedAt: industry.updatedAt,
  };
}
