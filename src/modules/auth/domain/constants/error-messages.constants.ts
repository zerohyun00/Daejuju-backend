export const AUTH_ERROR_MESSAGES = {
  // 토큰 관련
  TOKEN_NOT_PROVIDED: '인증 토큰이 없습니다',
  TOKEN_INVALID: '유효하지 않은 토큰입니다',
  TOKEN_EXPIRED_OR_LOGGED_OUT: '토큰이 만료되었거나 로그아웃되었습니다',
  TOKEN_VERIFICATION_FAILED: '토큰 검증에 실패했습니다',

  // 로그인 관련
  INVALID_CREDENTIALS: '이메일 또는 비밀번호가 올바르지 않습니다',

  // Refresh Token 관련
  REFRESH_TOKEN_INVALID: '유효하지 않은 Refresh Token입니다',
} as const;

