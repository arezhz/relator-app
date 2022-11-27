import { HomePropertyType } from '@prisma/client';
import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { AllHomesDto } from './dtos/home.dto';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}
  @Get()
  getAllHomes(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: HomePropertyType,
  ): Promise<AllHomesDto[]> {
    const price =
      minPrice || maxPrice
        ? {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { let: parseFloat(maxPrice) }),
          }
        : undefined;

    const queryParams = {
      ...(city && { city }),
      ...(price && { price }),
      ...(propertyType && { propertyType }),
    };
    return this.homeService.getAllHomes(queryParams);
  }
  @Get('/:id')
  getHome(
    @Param('id', ParseIntPipe) id: number
  ) {
    this.homeService.getHome(id);
  }
}
