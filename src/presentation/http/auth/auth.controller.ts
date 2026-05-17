import { Body, Controller, Get, Post, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LoginUseCase } from '../../../application/use-cases/login.use-case';
import { RegisterUserUseCase } from '../../../application/use-cases/register-user.use-case';
import { Public } from './public.decorator';
import { LoginRequestDto } from './login.request.dto';
import { AuthSessionResponseDto } from './auth-session.response.dto';
import { CurrentUserResponseDto } from './current-user.response.dto';
import { CurrentUser } from './current-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUserUseCase: RegisterUserUseCase,
  ) {}

  @Public()
  @Post('login')
  @ApiOkResponse({ type: AuthSessionResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async login(@Body() body: LoginRequestDto): Promise<AuthSessionResponseDto> {
    const session = await this.loginUseCase.execute({
      username: body.username,
      password: body.password,
    });

    if (!session) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return session;
  }

  @Public()
  @Post('register')
  @ApiOkResponse({ type: AuthSessionResponseDto })
  async register(@Body() body: LoginRequestDto): Promise<AuthSessionResponseDto> {
    return this.registerUserUseCase.execute({
      username: body.username,
      password: body.password,
    });
  }

  @Get('me')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: CurrentUserResponseDto })
  getMe(@CurrentUser() user: CurrentUserResponseDto): CurrentUserResponseDto {
    return user;
  }
}
