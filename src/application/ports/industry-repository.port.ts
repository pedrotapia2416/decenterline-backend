import { Industry } from '../../domain/industry/industry.model';

export const INDUSTRY_REPOSITORY_PORT = Symbol('INDUSTRY_REPOSITORY_PORT');

export interface IndustryRepositoryPort {
  findBySlug(slug: string): Promise<Industry | null>;
  findAll(): Promise<Industry[]>;
  findActive(): Promise<Industry[]>;
  create(industry: Industry): Promise<void>;
  update(
    slug: string,
    patch: Partial<Omit<Industry, 'slug' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Industry | null>;
  delete(slug: string): Promise<boolean>;
  ensureIndustry(industry: Industry): Promise<void>;
}
