import { Module } from '@nestjs/common';
import { NfcService } from 'src/modules/menu/manager/nfc/nfc.service';
import { KnexService } from 'src/knex/knex.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [NfcService, KnexService, JwtService]
})
export class NfcModule {}