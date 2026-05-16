export const AUTH_CONFIG_PORT = Symbol('AUTH_CONFIG_PORT');

export interface AuthConfigPort {
  getTokenSecret(): string;
  getTokenTtlSeconds(): number;
}
