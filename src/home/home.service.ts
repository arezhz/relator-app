import { Injectable, NotFoundException } from '@nestjs/common';
import { ConnectionService } from './../connection/connection.service';
import { AllHomesDto, SingleHomeDto } from './dtos/home.dto';
import { IAllHomesFilters } from './models/i-all-homes-filters';

@Injectable()
export class HomeService {
  constructor(private readonly connectionService: ConnectionService) {}
  async getAllHomes(filters: IAllHomesFilters): Promise<AllHomesDto[]> {
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
      where: filters,
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

  async getHome(id: number): Promise<SingleHomeDto> {
    const home = await this.connectionService.home.findUnique({
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
        },
        relator: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      where: { id },
    });

    if (!home) {
      throw new NotFoundException('The email or Password is wrong!');
    }

    let images: string[] | null = [];
    if (home.Images.length > 0) {
      home.Images.forEach((image) => {
        images.push(image.url);
      });
    } else {
      images = null;
    }

    const finalResult = {
      ...home,
      images,
    };

    delete finalResult.Images;

    return new SingleHomeDto(finalResult);
  }
}
