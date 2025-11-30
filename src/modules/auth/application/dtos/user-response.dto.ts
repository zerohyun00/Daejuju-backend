/**
 * User 정보 Response DTO
 * 로그인/토큰 갱신 시 사용자 정보 반환
 */
export class UserResponseDto {
  userId: string;
  email: string;
  role: string;

  constructor(userId: string, email: string, role: string) {
    this.userId = userId;
    this.email = email;
    this.role = role;
  }
}

