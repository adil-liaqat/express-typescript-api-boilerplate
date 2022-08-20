import jwt from 'jsonwebtoken';

export const REFRESH_TOKEN_EXPIRY_IN_DAYS: number = 7;
export const ACCESS_TOKEN_EXPIRY: number | string = '1h';
export const JWT_ALGORITHM: jwt.Algorithm = 'HS256';
