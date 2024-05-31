import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDto } from 'src/auth/dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtUser } from 'src/user/interfaces/jwt-user.interface';
import { LoginResponseDto } from 'src/user/dto/login-response.dto';
import { MysqlService } from 'src/mysql/mysql.service';
import { AuthSql } from 'src/auth/sql/auth.sql';

@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService,
    private mysqlService: MysqlService,
  ) {}

  /**
   * 사용자로부터 id와 비밀번호를 받아서 로그인을 처리합니다.
   *
   * @param userDto 유저가 보낸 id와 비밀번호를 담는 dto
   * @return JwtUser
   */
  async login(userDto: UserDto): Promise<LoginResponseDto> {
    const { id, pwd } = userDto;
    const user = await this.mysqlService.adminConnection.queryLimitOne<JwtUser>(
      AuthSql.getUserInfo, [id, pwd]
    );

    if (user === undefined) {
      throw new UnauthorizedException();
    }

    // knex에서 RowDataPacket을 반환하기 때문에 객체 스프레드를 통해 플레인 객체로 만들어줍니다.
    return {
      jwt: await this.jwtService.signAsync(user),
      user,
    };
  }
}