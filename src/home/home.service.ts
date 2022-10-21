import { Injectable } from '@nestjs/common';
import { ConnectionService } from 'src/connection/connection.service';

@Injectable()
export class HomeService {
  constructor(private readonly connectionService: ConnectionService) {}
  getAllHomes() {
    return this.connectionService.home.findMany();
  }
}
