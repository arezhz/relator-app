import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { ConnectionModule } from './../connection/connection.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  providers: [
    HomeService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
  controllers: [HomeController],
  imports: [ConnectionModule],
})
export class HomeModule {}
