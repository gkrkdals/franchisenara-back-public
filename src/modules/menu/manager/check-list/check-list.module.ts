import { Module } from '@nestjs/common';
import { CheckListService } from './check-list.service';
import { CheckListController } from './check-list.controller';
import { KnexService } from 'src/knex/knex.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [CheckListController],
  providers: [CheckListService, KnexService, JwtService]
})
export class CheckListModule {}
