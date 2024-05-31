import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import { JwtUser } from 'src/user/interfaces/jwt-user.interface';
import { SupervisorService } from 'src/modules/supervisor/supervisor.service';
import Customer from 'src/model/supervisor/customer';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('수퍼바이저 API')
@UseGuards(AuthGuard)
@Controller('supervisor')
export class SupervisorController {

  constructor(private supervisorService: SupervisorService) {}

  @Get('customers')
  async getSpvUser(@User() user: JwtUser): Promise<Customer[]> {
    return await this.supervisorService.getCusList(user);
  }

}