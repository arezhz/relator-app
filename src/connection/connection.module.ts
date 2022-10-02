import { Module } from '@nestjs/common';
import { ConnectionService } from './connection.service';

@Module({
  providers: [ConnectionService],
  imports: [ConnectionService],
  exports: [ConnectionService],
})
export class ConnectionModule {}
