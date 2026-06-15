import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Industry } from '../../domain/industry/industry.model';
import { INDUSTRY_REPOSITORY_PORT, IndustryRepositoryPort } from '../ports/industry-repository.port';

@Injectable()
export class CreateIndustryUseCase {
  constructor(
    @Inject(INDUSTRY_REPOSITORY_PORT)
    private readonly industryRepository: IndustryRepositoryPort,
  ) {}

  async execute(input: Omit<Industry, 'createdAt' | 'updatedAt'>): Promise<Industry> {
    const existing = await this.industryRepository.findBySlug(input.slug);
    if (existing) {
      throw new ConflictException('Industry already exists');
    }

    const now = new Date().toISOString();
    const industry: Industry = {
      ...input,
      createdAt: now,
      updatedAt: now,
    };

    await this.industryRepository.create(industry);
    return industry;
  }
}
