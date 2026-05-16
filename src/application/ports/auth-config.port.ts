export const AUTH_CONFIG_PORT = Symbol('AUTH_CONFIG_PORT');

export interface AuthConfigPort {
  getUsername(): string;
  getPassword(): string;
  getTokenSecret(): string;
  getTokenTtlSeconds(): number;
}
