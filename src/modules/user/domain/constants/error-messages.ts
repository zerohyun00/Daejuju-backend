/**
 * 에러 메시지 상수
 */

export const ERROR_MESSAGES = {
  // 공통
  UNEXPECTED_ERROR: '예상치 못한 오류가 발생했습니다.',
  INVALID_INPUT: '잘못된 입력값입니다.',
  UNAUTHORIZED: '인증이 필요합니다.',
  FORBIDDEN: '접근 권한이 없습니다.',
  NOT_FOUND: '요청한 리소스를 찾을 수 없습니다.',

  // User
  USER_NOT_FOUND: '사용자를 찾을 수 없습니다.',
  USER_ALREADY_EXISTS: '이미 가입된 이메일입니다.',
  USER_CREATION_FAILED: '사용자 생성에 실패했습니다.',
  USER_UPDATE_FAILED: '사용자 정보 수정에 실패했습니다.',
  USER_DELETION_FAILED: '사용자 삭제에 실패했습니다.',

  // Email Verification
  EMAIL_NOT_VERIFIED: '이메일 인증이 완료되지 않았습니다.',
  EMAIL_VERIFICATION_NOT_FOUND: '이메일 인증 정보를 찾을 수 없습니다.',
  EMAIL_VERIFICATION_EXPIRED: '인증 코드가 만료되었습니다.',
  EMAIL_VERIFICATION_CODE_INVALID: '잘못된 인증 코드입니다.',
  EMAIL_VERIFICATION_ALREADY_VERIFIED: '이미 인증된 이메일입니다.',
  EMAIL_SEND_FAILED: '이메일 발송에 실패했습니다.',
  EMAIL_RESEND_COOLDOWN: '인증 이메일을 너무 자주 요청하고 있습니다.',

  // Profile
  PROFILE_NOT_FOUND: '프로필을 찾을 수 없습니다.',
  PROFILE_UPDATE_FAILED: '프로필 수정에 실패했습니다.',

  // Auth
  INVALID_CREDENTIALS: '이메일 또는 비밀번호가 올바르지 않습니다.',
  TOKEN_EXPIRED: '토큰이 만료되었습니다.',
  TOKEN_INVALID: '유효하지 않은 토큰입니다.',
  REFRESH_TOKEN_NOT_FOUND: 'Refresh Token을 찾을 수 없습니다.',

  // Password
  PASSWORD_TOO_WEAK: '비밀번호가 너무 약합니다.',
  PASSWORD_MISMATCH: '비밀번호가 일치하지 않습니다.',

  // Database
  DB_CONNECTION_FAILED: '데이터베이스 연결에 실패했습니다.',
  DB_QUERY_FAILED: '데이터베이스 쿼리 실행에 실패했습니다.',
  DB_TRANSACTION_FAILED: '트랜잭션 처리에 실패했습니다.',

  // Redis
  REDIS_CONNECTION_FAILED: 'Redis 연결에 실패했습니다.',
  REDIS_OPERATION_FAILED: 'Redis 작업에 실패했습니다.',
  REDIS_CACHE_GET_ERROR: 'Redis 캐시 조회에 실패했습니다.',
  REDIS_CACHE_SET_ERROR: 'Redis 캐시 저장에 실패했습니다.',
  REDIS_CACHE_DEL_ERROR: 'Redis 캐시 삭제에 실패했습니다.',

  // Service
  SERVICE_UNAVAILABLE: '서비스를 일시적으로 사용할 수 없습니다.',
  EXTERNAL_API_ERROR: '외부 API 호출에 실패했습니다.',

  // Validation
  VALIDATION_FAILED: '입력값 검증에 실패했습니다.',
  EMAIL_FORMAT_INVALID: '유효하지 않은 이메일 형식입니다.',
  EMAIL_REQUIRED: '이메일은 필수입니다.',
  PASSWORD_REQUIRED: '비밀번호는 필수입니다.',
  PASSWORD_MIN_LENGTH: '비밀번호는 최소 8자 이상이어야 합니다.',
  NAME_REQUIRED: '이름은 필수입니다.',
  NAME_MAX_LENGTH: '이름은 최대 20자까지 가능합니다.',
} as const;

