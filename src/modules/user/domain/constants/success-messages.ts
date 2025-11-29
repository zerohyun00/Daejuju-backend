/**
 * 성공 메시지 상수
 */

export const SUCCESS_MESSAGES = {
  // Email Verification
  EMAIL_VERIFICATION_SENT: '인증 코드가 이메일로 발송되었습니다. 5분 내에 인증을 완료해주세요.',
  EMAIL_VERIFIED: '이메일 인증이 완료되었습니다.',

  // User Registration
  USER_REGISTERED: '회원가입이 완료되었습니다.',

  // Profile
  PROFILE_UPDATED: '프로필이 수정되었습니다.',

  // Auth
  LOGIN_SUCCESS: '로그인에 성공했습니다.',
  LOGOUT_SUCCESS: '로그아웃 되었습니다.',
} as const;

