import { Injectable } from '@nestjs/common';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { PasswordHasherPort } from '../../application/ports/password-hasher.port';

@Injectable()
export class ScryptPasswordHasherService implements PasswordHasherPort {
  hash(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const derived = scryptSync(password, salt, 64) as Buffer;
    return `scrypt$${salt}$${derived.toString('hex')}`;
  }

  verify(password: string, hash: string): boolean {
    const [algorithm, salt, storedKey] = hash.split('$');

    if (algorithm !== 'scrypt' || !salt || !storedKey) {
      return false;
    }

    const derived = scryptSync(password, salt, 64) as Buffer;
    const storedKeyBuffer = Buffer.from(storedKey, 'hex');

    if (storedKeyBuffer.length !== derived.length) {
      return false;
    }

    return timingSafeEqual(storedKeyBuffer, derived);
  }
}
