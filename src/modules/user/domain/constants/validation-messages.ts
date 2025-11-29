export const VALIDATION_MESSAGES = {
  // Email
  EMAIL_REQUIRED: '이메일은 필수입니다',
  EMAIL_INVALID: '유효한 이메일 주소를 입력해주세요',

  // Password
  PASSWORD_REQUIRED: '비밀번호는 필수입니다',
  PASSWORD_MIN_LENGTH: '비밀번호는 최소 8자 이상이어야 합니다',
  PASSWORD_INVALID: '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다',

  // Name
  NAME_REQUIRED: '이름은 필수입니다',
  NAME_MAX_LENGTH: '이름은 최대 20자까지 가능합니다',

  // Verification Code
  CODE_REQUIRED: '인증 코드는 필수입니다',
  CODE_FORMAT_INVALID: '인증 코드는 6자리 숫자여야 합니다',

  // Avatar
  AVATAR_URL_INVALID: '유효한 URL 형식이 아닙니다',
} as const;