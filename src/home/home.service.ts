import { Injectable, NotFoundException } from '@nestjs/common';
import { ConnectionService } from './../connection/connection.service';
import { AllHomesDto, SingleHomeDto } from './dtos/home.dto';
import { IAllHomesFilters } from './models/i-all-homes-filters';
import { ICreateHomeModel } from './models/i-create-home-model';
import { IModifyHomeModel } from './models/i-modify-home-model';

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

  async createHome(data: ICreateHomeModel) {
    const {
      address,
      numberOfBedrooms,
      numberOfBathrooms,
      city,
      price,
      landSize,
      propertyType,
      images,
    } = data;
    const home = await this.connectionService.home.create({
      data: {
        address,
        number_of_bedrooms: numberOfBedrooms,
        number_of_bathrooms: numberOfBathrooms,
        city,
        price,
        land_size: landSize,
        property_type: propertyType,
        relator_id: 1,
        Images: {
          createMany: {
            data: [...images],
          },
        },
      },
    });

    return home.id;
  }

  async modifyHome(homeId: number, body: IModifyHomeModel) {
    const data = {
      ...body,
      number_of_bedrooms: body.numberOfBedrooms,
      number_of_bathrooms: body.numberOfBathrooms,
      land_size: body.landSize,
      property_type: body.propertyType,
    };
    const home = await this.connectionService.home.findUnique({
      where: {
        id: homeId,
      },
    });
    if (!home) {
      throw new NotFoundException('The email or Password is wrong!');
    }
    const response = await this.connectionService.home.update({
      where: {
        id: homeId,
      },
      data,
    });

    return response.id;
  }

  async removeHome(homeId: number) {
    const deleteHomeImages = this.connectionService.images.deleteMany({
      where: {
        home_id: homeId,
      },
    });
    const deleteHome = this.connectionService.home.delete({
      where: {
        id: homeId,
      },
    });

    await this.connectionService.$transaction([deleteHomeImages, deleteHome]);

    return homeId;
  }
}
