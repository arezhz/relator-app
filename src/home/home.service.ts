import { Injectable } from '@nestjs/common';
import { ConnectionService } from 'src/connection/connection.service';
import { AllHomesDto } from './dtos/home.dto';

@Injectable()
export class HomeService {
  constructor(private readonly connectionService: ConnectionService) { }
  async getAllHomes(): Promise<AllHomesDto[]> {
    const homes = await this.connectionService.home.findMany({
      select: {
        id: true,
        address: true,
        city: true,
        price: true,
        number_of_bathrooms: true,
        number_of_bedrooms: true,
        listed_date: true,
        land_size: true,
        property_type: true,
        Images: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
    });
    return homes.map((m) => {
      const fetchData = {
        ...m,
        image: m.Images.length > 0 ? m.Images[0].url : null,
      };

      delete fetchData.Images;
      return new AllHomesDto(fetchData);
    });
  }
}
