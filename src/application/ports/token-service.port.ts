import { AccessTokenPayload } from '../../domain/auth/auth.model';

export const TOKEN_SERVICE_PORT = Symbol('TOKEN_SERVICE_PORT');

export interface TokenServicePort {
  sign(principal: { username: string; roles: string[] }): string;
  verify(token: string): AccessTokenPayload | null;
  getTtlSeconds(): number;
}
