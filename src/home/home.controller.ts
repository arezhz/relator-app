import { HomePropertyType } from '@prisma/client';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AllHomesDto, CreateHomeDto, ModifyHomeDto } from './dtos/home.dto';
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

  @Get(':id')
  getHome(@Param('id', ParseIntPipe) id: number) {
    return this.homeService.getHome(id);
  }

  @Post()
  createHome(@Body() body: CreateHomeDto) {
    return this.homeService.createHome(body);
  }

  @Patch(':id')
  modifyHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ModifyHomeDto,
  ) {
    return this.homeService.modifyHome(id, body);
  }

  @Delete(':id')
  removeHome(@Param('id', ParseIntPipe) id: number) {
    return this.homeService.removeHome(id);
  }
}
