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

  async ensureRole(role: Role): Promise<void> {
    await this.collection().updateOne(
      { name: role.name },
      {
        $setOnInsert: {
          name: role.name,
          description: role.description,
          permissions: role.permissions,
          createdAt: new Date(role.createdAt),
          updatedAt: new Date(role.updatedAt),
        },
      },
      { upsert: true },
    );
  }

  private collection(): Collection<RoleDocument> {
    return this.mongoService.getDb().collection<RoleDocument>('roles');
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
