import { Injectable } from '@nestjs/common';
import { Collection } from 'mongodb';
import { UserAccount } from '../../domain/user/user.model';
import { UserRepositoryPort } from '../../application/ports/user-repository.port';
import { MongoService } from './mongo.service';

type UserDocument = {
  username: string;
  passwordHash: string;
  roles: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class MongoUserRepository implements UserRepositoryPort {
  constructor(private readonly mongoService: MongoService) {}

  async findByUsername(username: string): Promise<UserAccount | null> {
    const document = await this.collection().findOne({ username });
    return document ? this.toDomain(document) : null;
  }

  async findAll(): Promise<UserAccount[]> {
    const documents = await this.collection().find({}).sort({ username: 1 }).toArray();
    return documents.map((document) => this.toDomain(document));
  }

  async create(user: UserAccount): Promise<void> {
    await this.collection().insertOne(this.toDocument(user));
  }

  async update(
    username: string,
    patch: Partial<Pick<UserAccount, 'passwordHash' | 'roles' | 'active'>>,
  ): Promise<UserAccount | null> {
    const setPatch: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if ('passwordHash' in patch) {
      setPatch.passwordHash = patch.passwordHash;
    }

    if ('roles' in patch) {
      setPatch.roles = patch.roles;
    }

    if ('active' in patch) {
      setPatch.active = patch.active;
    }

    const result = await this.collection().updateOne({ username }, { $set: setPatch });
    if (result.matchedCount === 0) {
      return null;
    }

    return this.findByUsername(username);
  }

  async delete(username: string): Promise<boolean> {
    const result = await this.collection().deleteOne({ username });
    return result.deletedCount > 0;
  }

  async ensureUser(user: UserAccount): Promise<void> {
    await this.collection().updateOne(
      { username: user.username },
      {
        $setOnInsert: {
          ...this.toDocument(user),
        },
      },
      { upsert: true },
    );
  }

  private collection(): Collection<UserDocument> {
    return this.mongoService.getDb().collection<UserDocument>('users');
  }

  private toDocument(user: UserAccount): UserDocument {
    return {
      username: user.username,
      passwordHash: user.passwordHash,
      roles: user.roles,
      active: user.active,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
    };
  }

  private toDomain(document: UserDocument): UserAccount {
    return {
      username: document.username,
      passwordHash: document.passwordHash,
      roles: document.roles,
      active: document.active,
      createdAt: document.createdAt.toISOString(),
      updatedAt: document.updatedAt.toISOString(),
    };
  }
}
