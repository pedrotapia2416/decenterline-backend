import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Industry } from '../../domain/industry/industry.model';
import { INDUSTRY_REPOSITORY_PORT, IndustryRepositoryPort } from '../ports/industry-repository.port';

@Injectable()
export class UpdateIndustryUseCase {
  constructor(
    @Inject(INDUSTRY_REPOSITORY_PORT)
    private readonly industryRepository: IndustryRepositoryPort,
  ) {}

  async execute(
    slug: string,
    patch: Partial<Omit<Industry, 'slug' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Industry> {
    const updated = await this.industryRepository.update(slug, patch);
    if (!updated) {
      throw new NotFoundException('Industry not found');
    }

    return updated;
  }
}
