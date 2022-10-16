import { UserType } from '@prisma/client';
import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { ProductKeyDto, SignInDto, SignupDto } from '../dtos/auth.dto';
import { Param } from '@nestjs/common/decorators';
import { ParseEnumPipe } from '@nestjs/common/pipes';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/signup/:userType')
  signup(
    @Body() body: SignupDto,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ) {
    return this.authService.signup(body, userType);
  }

  @Post('/signin')
  signIn(@Body() body: SignInDto) {
    return this.authService.signin(body);
  }

  @Post('/productKey')
  generateProductKey(@Body() { email, userType }: ProductKeyDto) {
    return this.authService.generateProductKey(email, userType);
  }
}
