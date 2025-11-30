/**
 * 인증 토큰 캐시 키 생성
 * @param email 사용자 이메일
 * @returns auth:{email}
 */
export const getAuthTokenCacheKey = (email: string): string => {
  return `auth:${email}`;
};

/**
 * Refresh Token 캐시 키 생성 (선택적)
 * @param userId 사용자 ID
 * @returns auth:refresh:{userId}
 */
export const getRefreshTokenCacheKey = (userId: string): string => {
  return `auth:refresh:${userId}`;
};

export const AUTH_TOKEN_PATTERN = 'auth:*';

/**
 * 캐시 TTL (초)
 */
export const AUTH_CACHE_TTL = {
  ACCESS_TOKEN: 900,      // 15분 (Access Token TTL과 동일)
  REFRESH_TOKEN: 604800,  // 7일 (Refresh Token TTL과 동일)
} as const;

