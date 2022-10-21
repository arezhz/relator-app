import { Injectable } from '@nestjs/common';
import { ConnectionService } from 'src/connection/connection.service';
import { AllHomesDto } from './dtos/home.dto';

@Injectable()
export class HomeService {
  constructor(private readonly connectionService: ConnectionService) {}
  async getAllHomes(): Promise<AllHomesDto[]> {
    const homes = await this.connectionService.home.findMany();
    return homes.map((m) => new AllHomesDto(m));
  }
}
