/**
 * Auth 모듈 Validation 메시지 상수
 * DTO 검증 시 사용
 */

export const AUTH_VALIDATION_MESSAGES = {
  // 이메일
  EMAIL_INVALID: '유효한 이메일을 입력해주세요',
  EMAIL_REQUIRED: '이메일은 필수입니다',

  // 비밀번호
  PASSWORD_REQUIRED: '비밀번호는 필수입니다',

  // Refresh Token
  REFRESH_TOKEN_REQUIRED: 'Refresh Token은 필수입니다',
} as const;

