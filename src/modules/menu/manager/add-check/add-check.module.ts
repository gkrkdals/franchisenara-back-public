import { Module } from '@nestjs/common';
import { AddCheckService } from './add-check.service';
import { AddCheckController } from './add-check.controller';
import { KnexService } from 'src/knex/knex.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AddCheckController],
  providers: [AddCheckService, KnexService, JwtService]
})
export class AddCheckModule {}
