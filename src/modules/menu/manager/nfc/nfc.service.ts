import { Injectable } from '@nestjs/common';
import { KnexService } from 'src/knex/knex.service';

@Injectable()
export class NfcService {

  constructor(private knexService: KnexService) {}



}