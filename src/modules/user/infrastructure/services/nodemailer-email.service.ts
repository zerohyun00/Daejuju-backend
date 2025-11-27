import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { IEmailService } from '../../application/ports/email.service.interface';

@Injectable()
export class NodemailerEmailService implements IEmailService {
  private readonly logger = new Logger(NodemailerEmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST'),
      port: this.configService.get('EMAIL_PORT'),
      secure: this.configService.get('EMAIL_SECURE') === 'true',
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    });
  }

  async sendVerificationEmail(email: string, code: string): Promise<void> {
    const mailOptions = {
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject: '[대주주] 이메일 인증 코드',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>대주주 이메일 인증</h2>
          <p>안녕하세요! 대주주에 가입해주셔서 감사합니다.</p>
          <p>아래 인증 코드를 입력하여 이메일 인증을 완료해주세요.</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #4CAF50; margin: 0; font-size: 36px; letter-spacing: 8px;">
              ${code}
            </h1>
          </div>
          
          <p style="color: #666;">이 인증 코드는 <strong>5분간 유효</strong>합니다.</p>
          <p style="color: #666;">본인이 요청하지 않았다면 이 이메일을 무시해주세요.</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #999; font-size: 12px;">대주주 팀 드림</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`인증 이메일 발송 성공: ${email}`);
    } catch (error) {
      this.logger.error(`인증 이메일 발송 실패: ${email}`, error);
      throw error;
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const mailOptions = {
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject: '[대주주] 회원가입을 환영합니다! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>환영합니다, ${name}님! 🎉</h2>
          <p>대주주 커뮤니티에 오신 것을 환영합니다.</p>
          <p>이제 다양한 대학생 투자자들과 함께 투자 경험을 공유하고 성장할 수 있습니다.</p>
          
          <div style="background-color: #4CAF50; color: white; padding: 15px; text-align: center; margin: 20px 0; border-radius: 5px;">
            <a href="${this.configService.get('FRONTEND_URL')}" style="color: white; text-decoration: none; font-weight: bold;">
              지금 시작하기 →
            </a>
          </div>
          
          <p>궁금한 점이 있으시면 언제든지 문의해주세요.</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #999; font-size: 12px;">대주주 팀 드림</p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
    this.logger.log(`환영 이메일 발송 성공: ${email}`);
  }
}

