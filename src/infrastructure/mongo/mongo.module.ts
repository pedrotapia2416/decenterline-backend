import { Module } from '@nestjs/common';
import { MongoBootstrapService } from './mongo.bootstrap.service';
import { MongoRoleRepository } from './mongo-role.repository';
import { MongoService } from './mongo.service';
import { MongoUserRepository } from './mongo-user.repository';
import { ScryptPasswordHasherService } from './scrypt-password-hasher.service';

@Module({
  providers: [MongoService, MongoUserRepository, MongoRoleRepository, ScryptPasswordHasherService, MongoBootstrapService],
  exports: [MongoService, MongoUserRepository, MongoRoleRepository, ScryptPasswordHasherService],
})
export class MongoModule {}
