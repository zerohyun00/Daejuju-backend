/**
 * JWT 토큰 Payload
 * Guard를 통해 인증된 사용자 정보
 */
export interface UserPayload {
  /** 사용자 ID (UUID) */
  userId: string;

  /** 이메일 */
  email: string;

  /** 사용자 역할 */
  role: string;

  /** 대학 ID */
  universityId?: number;
}

/**
 * Express Request 확장
 * request.user 타입 정의
 */
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

