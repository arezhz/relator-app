import { ConnectionModule } from './../connection/connection.module';
import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [ConnectionModule],
})
export class UserModule {}
