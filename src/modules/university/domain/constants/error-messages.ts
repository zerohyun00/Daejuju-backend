/**
 * University 도메인 전용 에러 메시지
 */

export const UNIVERSITY_ERROR_MESSAGES = {
  // University 조회
  UNIVERSITY_NOT_FOUND: '대학교를 찾을 수 없습니다.',
  UNIVERSITY_DOMAIN_NOT_FOUND: '등록되지 않은 대학 도메인입니다.',

  // University 생성/수정
  UNIVERSITY_ALREADY_EXISTS: '이미 등록된 대학교입니다.',
  UNIVERSITY_DOMAIN_INVALID: '유효하지 않은 대학 도메인 형식입니다.',

  // University 도메인 검증
  UNIVERSITY_DOMAIN_REQUIRED: '대학 도메인은 필수입니다.',
  UNIVERSITY_NAME_REQUIRED: '대학 이름은 필수입니다.',
} as const;

