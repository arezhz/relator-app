import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { SignupDto } from '../dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  signup(@Body() body: SignupDto) {
    return 'this.authService.signup();';
  }
}
