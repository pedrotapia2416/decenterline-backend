export interface AuthPrincipal {
  username: string;
  roles: string[];
}

export interface AccessTokenPayload extends AuthPrincipal {
  iat: number;
  exp: number;
}

export interface AuthSession {
  accessToken: string;
  tokenType: 'Bearer';
  expiresAt: string;
  expiresInSeconds: number;
  user: AuthPrincipal;
}
