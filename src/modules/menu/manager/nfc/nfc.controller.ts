import { ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@ApiTags('NFC API')
@UseGuards(AuthGuard)
@Controller('nfc')
export class NfcController {

}