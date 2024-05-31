import { Module } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { AuthController } from 'src/auth/auth.controller';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { MysqlService } from 'src/mysql/mysql.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get<JwtModuleOptions>("jwtConfig")
    }),
    UserModule,
  ],
  providers: [AuthService, MysqlService],
  controllers: [AuthController],
})
export class AuthModule {}