import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { MongoService } from './mongo.service';
import { MongoRoleRepository } from './mongo-role.repository';
import { MongoUserRepository } from './mongo-user.repository';
import { ScryptPasswordHasherService } from './scrypt-password-hasher.service';

@Injectable()
export class MongoBootstrapService implements OnApplicationBootstrap {
  constructor(
    private readonly mongoService: MongoService,
    private readonly roleRepository: MongoRoleRepository,
    private readonly userRepository: MongoUserRepository,
    private readonly passwordHasher: ScryptPasswordHasherService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.ensureIndexes();
    await this.ensureRoles();
    await this.ensureBootstrapUser();
  }

  private async ensureIndexes(): Promise<void> {
    const db = this.mongoService.getDb();
    await Promise.all([
      db.collection('users').createIndex({ username: 1 }, { unique: true }),
      db.collection('roles').createIndex({ name: 1 }, { unique: true }),
    ]);
  }

  private async ensureRoles(): Promise<void> {
    const now = new Date().toISOString();

    await this.roleRepository.ensureRole({
      name: 'admin',
      description: 'Full access role for internal administration',
      permissions: ['*'],
      createdAt: now,
      updatedAt: now,
    });

    await this.roleRepository.ensureRole({
      name: 'user',
      description: 'Default authenticated user role',
      permissions: ['profile:read'],
      createdAt: now,
      updatedAt: now,
    });
  }

  private async ensureBootstrapUser(): Promise<void> {
    const username = process.env.AUTH_BOOTSTRAP_USERNAME;
    const password = process.env.AUTH_BOOTSTRAP_PASSWORD;
    const rawRoles = process.env.AUTH_BOOTSTRAP_ROLES ?? 'admin';

    if (!username || !password) {
      return;
    }

    const existingUser = await this.userRepository.findByUsername(username);
    if (existingUser) {
      return;
    }

    const roles = rawRoles
      .split(',')
      .map((role) => role.trim())
      .filter(Boolean);

    const now = new Date().toISOString();
    await this.userRepository.ensureUser({
      username,
      passwordHash: this.passwordHasher.hash(password),
      roles,
      active: true,
      createdAt: now,
      updatedAt: now,
    });
  }
}
