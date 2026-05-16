import { Inject, Injectable } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import { AUTH_CONFIG_PORT, AuthConfigPort } from '../../application/ports/auth-config.port';
import { AccessTokenPayload } from '../../domain/auth/auth.model';
import { TokenServicePort } from '../../application/ports/token-service.port';

function encodeJson(value: unknown): string {
  return Buffer.from(JSON.stringify(value), 'utf8').toString('base64url');
}

function decodeJson<T>(value: string): T | null {
  try {
    return JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as T;
  } catch {
    return null;
  }
}

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left, 'utf8');
  const rightBuffer = Buffer.from(right, 'utf8');

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

@Injectable()
export class HmacTokenService implements TokenServicePort {
  constructor(
    @Inject(AUTH_CONFIG_PORT)
    private readonly authConfig: AuthConfigPort,
  ) {}

  sign(principal: { username: string; roles: string[] }): string {
    const issuedAtSeconds = Math.floor(Date.now() / 1000);
    const expiresInSeconds = this.getTtlSeconds();
    const payload: AccessTokenPayload = {
      username: principal.username,
      roles: principal.roles,
      iat: issuedAtSeconds,
      exp: issuedAtSeconds + expiresInSeconds,
    };

    const payloadPart = encodeJson(payload);
    const signaturePart = this.signPayload(payloadPart);
    return `${payloadPart}.${signaturePart}`;
  }

  verify(token: string): AccessTokenPayload | null {
    const [payloadPart, signaturePart] = token.split('.');

    if (!payloadPart || !signaturePart) {
      return null;
    }

    const expectedSignature = this.signPayload(payloadPart);
    if (!safeEqual(signaturePart, expectedSignature)) {
      return null;
    }

    const payload = decodeJson<AccessTokenPayload>(payloadPart);
    if (!payload || typeof payload.exp !== 'number' || typeof payload.iat !== 'number') {
      return null;
    }

    const nowSeconds = Math.floor(Date.now() / 1000);
    if (payload.exp <= nowSeconds) {
      return null;
    }

    return payload;
  }

  getTtlSeconds(): number {
    return this.authConfig.getTokenTtlSeconds();
  }

  private signPayload(payloadPart: string): string {
    return createHmac('sha256', this.authConfig.getTokenSecret())
      .update(payloadPart)
      .digest('base64url');
  }
}
