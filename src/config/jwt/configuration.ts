import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

/** jwt 설정 */
const jwtConfig = registerAs("jwtConfig", (): JwtModuleOptions => ({
  global: true,
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: 1000 * 60 * 60 * 24
  }
}));

export default jwtConfig;