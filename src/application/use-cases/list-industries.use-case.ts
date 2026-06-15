import { Inject, Injectable } from '@nestjs/common';
import { Industry } from '../../domain/industry/industry.model';
import { INDUSTRY_REPOSITORY_PORT, IndustryRepositoryPort } from '../ports/industry-repository.port';

@Injectable()
export class ListIndustriesUseCase {
  constructor(
    @Inject(INDUSTRY_REPOSITORY_PORT)
    private readonly industryRepository: IndustryRepositoryPort,
  ) {}

  async execute(input: { includeInactive?: boolean } = {}): Promise<Industry[]> {
    return input.includeInactive
      ? this.industryRepository.findAll()
      : this.industryRepository.findActive();
  }
}
