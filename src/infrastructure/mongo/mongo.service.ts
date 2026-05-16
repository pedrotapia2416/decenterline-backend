import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Db, MongoClient, ServerApiVersion } from 'mongodb';

@Injectable()
export class MongoService implements OnModuleInit, OnModuleDestroy {
  private client: MongoClient | null = null;
  private database: Db | null = null;

  async onModuleInit(): Promise<void> {
    const uri = process.env.MONGO_URI;
    const dbName = process.env.MONGO_DB_NAME ?? 'decenterline';

    if (!uri) {
      throw new Error('MONGO_URI is required');
    }

    this.client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    await this.client.connect();
    this.database = this.client.db(dbName);
    await this.database.command({ ping: 1 });
  }

  getDb(): Db {
    if (!this.database) {
      throw new Error('MongoDB is not initialized');
    }

    return this.database;
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.database = null;
    }
  }
}
