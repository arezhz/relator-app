import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { ConnectionModule } from 'src/connection/connection.module';

@Module({
  providers: [HomeService],
  controllers: [HomeController],
  imports: [ConnectionModule],
})
export class HomeModule {}
