import { Body, Controller, HttpCode, HttpStatus, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import { UserService } from 'src/user/user.service';
import { JwtUser } from 'src/user/interfaces/jwt-user.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('유저 API')
@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @User() user: JwtUser,
    @Body('pwd') pwd: string
  ) {
    return this.userService.changePassword(user, pwd);
  }
}