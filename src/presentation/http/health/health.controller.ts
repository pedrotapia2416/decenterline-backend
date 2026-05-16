import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  HEALTH_CHECK_PORT,
  HealthCheckPort,
} from '../../../application/ports/health-check.port';
import { HealthResponseDto } from './health.response.dto';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    @Inject(HEALTH_CHECK_PORT)
    private readonly healthCheckPort: HealthCheckPort,
  ) {}

  @Get()
  @ApiOkResponse({ type: HealthResponseDto })
  async getHealth(): Promise<HealthResponseDto> {
    return await this.healthCheckPort.execute();
  }
}
