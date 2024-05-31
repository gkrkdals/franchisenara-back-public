import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KnexService } from 'src/knex/knex.service';

/**
 * KnexModule은 전역 모듈입니다.
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [KnexService]
})
export class KnexModule {}