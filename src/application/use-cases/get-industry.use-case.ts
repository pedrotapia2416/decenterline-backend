import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Industry } from '../../domain/industry/industry.model';
import { INDUSTRY_REPOSITORY_PORT, IndustryRepositoryPort } from '../ports/industry-repository.port';

@Injectable()
export class GetIndustryUseCase {
  constructor(
    @Inject(INDUSTRY_REPOSITORY_PORT)
    private readonly industryRepository: IndustryRepositoryPort,
  ) {}

  async execute(slug: string): Promise<Industry> {
    const industry = await this.industryRepository.findBySlug(slug);
    if (!industry || !industry.active) {
      throw new NotFoundException('Industry not found');
    }

    return industry;
  }
}
