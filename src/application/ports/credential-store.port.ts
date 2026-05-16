import { AuthPrincipal } from '../../domain/auth/auth.model';

export const CREDENTIAL_STORE_PORT = Symbol('CREDENTIAL_STORE_PORT');

export interface CredentialStorePort {
  validate(username: string, password: string): Promise<AuthPrincipal | null> | AuthPrincipal | null;
}
