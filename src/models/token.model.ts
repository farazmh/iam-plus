export interface RefreshToken {
  token: string;
  userId: string;
  expiresAt: Date;
}

export const refreshTokens: RefreshToken[] = [];
