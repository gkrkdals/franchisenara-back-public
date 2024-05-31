import { Module } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { UserController } from 'src/user/user.controller';
import { JwtService } from '@nestjs/jwt';
import { KnexService } from 'src/knex/knex.service';

@Module({
  providers: [UserService, JwtService, KnexService],
  controllers: [UserController],
})
export class UserModule {}