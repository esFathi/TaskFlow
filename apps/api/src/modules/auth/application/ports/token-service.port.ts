// Port: token service contract (sign/verify JWT access & refresh tokens).
// Implemented in the infrastructure layer.

export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface TokenServicePort {
  generateTokens(payload: TokenPayload): Promise<AuthTokens>;

  verifyRefreshToken(token: string): Promise<any>;
}
