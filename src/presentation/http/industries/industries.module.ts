import { Module } from '@nestjs/common';
import { INDUSTRY_REPOSITORY_PORT } from '../../../application/ports/industry-repository.port';
import { CreateIndustryUseCase } from '../../../application/use-cases/create-industry.use-case';
import { DeleteIndustryUseCase } from '../../../application/use-cases/delete-industry.use-case';
import { GetIndustryUseCase } from '../../../application/use-cases/get-industry.use-case';
import { ListIndustriesUseCase } from '../../../application/use-cases/list-industries.use-case';
import { UpdateIndustryUseCase } from '../../../application/use-cases/update-industry.use-case';
import { MongoIndustryRepository } from '../../../infrastructure/mongo/mongo-industry.repository';
import { MongoModule } from '../../../infrastructure/mongo/mongo.module';
import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from '../auth/roles.guard';
import { IndustriesController } from './industries.controller';

@Module({
  imports: [AuthModule, MongoModule],
  controllers: [IndustriesController],
  providers: [
    ListIndustriesUseCase,
    GetIndustryUseCase,
    CreateIndustryUseCase,
    UpdateIndustryUseCase,
    DeleteIndustryUseCase,
    RolesGuard,
    {
      provide: INDUSTRY_REPOSITORY_PORT,
      useExisting: MongoIndustryRepository,
    },
  ],
})
export class IndustriesModule {}
