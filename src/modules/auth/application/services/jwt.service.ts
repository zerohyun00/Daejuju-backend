import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

/**
 * JWT Payload 인터페이스
 */
export interface JwtPayload {
  sub: string;      // userId
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * JWT Service
 * Access Token 및 Refresh Token 생성/검증
 */
@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly config: ConfigService,
  ) { }

  /**
   * Access Token 생성 
   */
  generateAccessToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    return this.jwtService.sign(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('JWT_ACCESS_EXPIRES_IN', '15m'),
    });
  }

  /**
   * Refresh Token 생성 
   */
  generateRefreshToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    return this.jwtService.sign(payload, {
      secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
    });
  }

  /**
   * Access Token 검증
   */
  async verifyAccessToken(token: string): Promise<JwtPayload | null> {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.config.get('JWT_SECRET'),
      });
    } catch (error) {
      return null;
    }
  }

  /**
   * Refresh Token 검증
   */
  async verifyRefreshToken(token: string): Promise<JwtPayload | null> {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
      });
    } catch (error) {
      return null;
    }
  }

  /**
   * 토큰 디코드
   */
  decodeToken(token: string): JwtPayload | null {
    try {
      return this.jwtService.decode(token) as JwtPayload;
    } catch {
      return null;
    }
  }
}

