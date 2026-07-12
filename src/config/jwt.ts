import { env } from './env';

export const jwtConfig = {
  accessSecret: env.JWT_ACCESS_SECRET,
  accessTokenExpiry: env.JWT_ACCESS_EXPIRES_IN,
  refreshSecret: env.JWT_REFRESH_SECRET,
  refreshTokenExpiry: env.JWT_REFRESH_EXPIRES_IN,
};
