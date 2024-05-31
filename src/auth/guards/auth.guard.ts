import { Request } from 'express';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtModuleOptions, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

/** jwt 기반 인증 가드입니다. */
@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  /**
   * request의 인증 토큰을 검사합니다.
   *
   * 인증에 실패 시, Unauthorized 예외를 발생시킵니다.
   *
   * @param context ExecutionContext
   * @return boolean
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    // request 객체에 유저의 정보를 넣음
    try {
      request['user'] = await this.jwtService.verifyAsync(
        token,
        {
          secret: this.configService.get<JwtModuleOptions>('jwtConfig').secret
        }
      );
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  /**
   * 헤더에서 jwt 토큰을 추출합니다.
   *
   * @private
   * @param request 클라이언트 요청
   * @return string
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}