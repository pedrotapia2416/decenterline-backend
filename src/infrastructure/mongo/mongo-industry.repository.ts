import { Injectable } from '@nestjs/common';
import { Collection } from 'mongodb';
import { Industry } from '../../domain/industry/industry.model';
import { IndustryRepositoryPort } from '../../application/ports/industry-repository.port';
import { MongoService } from './mongo.service';

type IndustryDocument = Omit<Industry, 'createdAt' | 'updatedAt'> & {
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class MongoIndustryRepository implements IndustryRepositoryPort {
  constructor(private readonly mongoService: MongoService) {}

  async findBySlug(slug: string): Promise<Industry | null> {
    const document = await this.collection().findOne({ slug });
    return document ? this.toDomain(document) : null;
  }

  async findAll(): Promise<Industry[]> {
    const documents = await this.collection().find({}).sort({ order: 1, name: 1 }).toArray();
    return documents.map((document) => this.toDomain(document));
  }

  async findActive(): Promise<Industry[]> {
    const documents = await this.collection().find({ active: true }).sort({ order: 1, name: 1 }).toArray();
    return documents.map((document) => this.toDomain(document));
  }

  async create(industry: Industry): Promise<void> {
    await this.collection().insertOne(this.toDocument(industry));
  }

  async update(
    slug: string,
    patch: Partial<Omit<Industry, 'slug' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Industry | null> {
    const setPatch: Record<string, unknown> = {
      ...patch,
      updatedAt: new Date(),
    };

    const result = await this.collection().updateOne({ slug }, { $set: setPatch });
    if (result.matchedCount === 0) {
      return null;
    }

    return this.findBySlug(slug);
  }

  async delete(slug: string): Promise<boolean> {
    const result = await this.collection().deleteOne({ slug });
    return result.deletedCount > 0;
  }

  async ensureIndustry(industry: Industry): Promise<void> {
    await this.collection().updateOne(
      { slug: industry.slug },
      {
        $setOnInsert: this.toDocument(industry),
      },
      { upsert: true },
    );
  }

  private collection(): Collection<IndustryDocument> {
    return this.mongoService.getDb().collection<IndustryDocument>('industries');
  }

  private toDocument(industry: Industry): IndustryDocument {
    return {
      ...industry,
      createdAt: new Date(industry.createdAt),
      updatedAt: new Date(industry.updatedAt),
    };
  }

  private toDomain(document: IndustryDocument): Industry {
    return {
      ...document,
      createdAt: document.createdAt.toISOString(),
      updatedAt: document.updatedAt.toISOString(),
    };
  }
}
