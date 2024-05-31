import { JwtUser } from 'src/user/interfaces/jwt-user.interface';

export class LoginResponseDto {
  jwt: string;
  user: JwtUser;
}