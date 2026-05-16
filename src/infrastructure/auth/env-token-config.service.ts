import { Injectable } from '@nestjs/common';
import { AuthConfigPort } from '../../application/ports/auth-config.port';

@Injectable()
export class EnvTokenConfigService implements AuthConfigPort {
  getTokenSecret(): string {
    return process.env.AUTH_TOKEN_SECRET ?? 'development-secret';
  }

  getTokenTtlSeconds(): number {
    const raw = Number(process.env.AUTH_TOKEN_TTL_SECONDS ?? '3600');
    return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 3600;
  }
}
