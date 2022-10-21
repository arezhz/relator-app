import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConnectionModule } from './connection/connection.module';
import { HomeModule } from './home/home.module';

@Module({
  imports: [UserModule, ConnectionModule, HomeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
