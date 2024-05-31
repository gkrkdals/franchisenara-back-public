import { Body, Controller, Get, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UserDto } from 'src/auth/dto/user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('인증 API')
@Controller('auth')
export class AuthController {
  constructor(private userService: AuthService) {}

  @Get('hello')
  async getHello() {
    return "Hello, world!";
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() userDto: UserDto) {
    return await this.userService.login(userDto);
  }

  // 인증이 되면 유저 정보를 반환
  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req: any) {
    return req.user;
  }
}