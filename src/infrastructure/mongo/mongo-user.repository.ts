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

  async ensureUser(user: UserAccount): Promise<void> {
    await this.collection().updateOne(
      { username: user.username },
      {
        $setOnInsert: {
          username: user.username,
          passwordHash: user.passwordHash,
          roles: user.roles,
          active: user.active,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
        },
      },
      { upsert: true },
    );
  }

  private collection(): Collection<UserDocument> {
    return this.mongoService.getDb().collection<UserDocument>('users');
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
