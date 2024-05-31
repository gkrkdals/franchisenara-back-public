import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtUser } from 'src/user/interfaces/jwt-user.interface';

/** request 객체에서 유저 정보를 가져오는 데코레이터입니다. */
export const User = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): JwtUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);