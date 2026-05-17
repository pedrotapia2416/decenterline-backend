import { Injectable } from '@nestjs/common';
import { Collection } from 'mongodb';
import { Role } from '../../domain/role/role.model';
import { RoleRepositoryPort } from '../../application/ports/role-repository.port';
import { MongoService } from './mongo.service';

type RoleDocument = {
  name: string;
  description?: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class MongoRoleRepository implements RoleRepositoryPort {
  constructor(private readonly mongoService: MongoService) {}

  async findByName(name: string): Promise<Role | null> {
    const document = await this.collection().findOne({ name });
    return document ? this.toDomain(document) : null;
  }

  async findAll(): Promise<Role[]> {
    const documents = await this.collection().find({}).sort({ name: 1 }).toArray();
    return documents.map((document) => this.toDomain(document));
  }

  async create(role: Role): Promise<void> {
    await this.collection().insertOne(this.toDocument(role));
  }

  async update(
    name: string,
    patch: Partial<Pick<Role, 'description' | 'permissions'>>,
  ): Promise<Role | null> {
    const setPatch: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if ('description' in patch) {
      setPatch.description = patch.description;
    }

    if ('permissions' in patch) {
      setPatch.permissions = patch.permissions;
    }

    const result = await this.collection().updateOne({ name }, { $set: setPatch });
    if (result.matchedCount === 0) {
      return null;
    }

    return this.findByName(name);
  }

  async delete(name: string): Promise<boolean> {
    const result = await this.collection().deleteOne({ name });
    return result.deletedCount > 0;
  }

  async ensureRole(role: Role): Promise<void> {
    await this.collection().updateOne(
      { name: role.name },
      {
        $setOnInsert: {
          ...this.toDocument(role),
        },
      },
      { upsert: true },
    );
  }

  private collection(): Collection<RoleDocument> {
    return this.mongoService.getDb().collection<RoleDocument>('roles');
  }

  private toDocument(role: Role): RoleDocument {
    return {
      name: role.name,
      description: role.description,
      permissions: role.permissions,
      createdAt: new Date(role.createdAt),
      updatedAt: new Date(role.updatedAt),
    };
  }

  private toDomain(document: RoleDocument): Role {
    return {
      name: document.name,
      description: document.description,
      permissions: document.permissions,
      createdAt: document.createdAt.toISOString(),
      updatedAt: document.updatedAt.toISOString(),
    };
  }
}
