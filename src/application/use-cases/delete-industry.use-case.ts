import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { INDUSTRY_REPOSITORY_PORT, IndustryRepositoryPort } from '../ports/industry-repository.port';

@Injectable()
export class DeleteIndustryUseCase {
  constructor(
    @Inject(INDUSTRY_REPOSITORY_PORT)
    private readonly industryRepository: IndustryRepositoryPort,
  ) {}

  async execute(slug: string): Promise<void> {
    const deleted = await this.industryRepository.delete(slug);
    if (!deleted) {
      throw new NotFoundException('Industry not found');
    }
  }
}
