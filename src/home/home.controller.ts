import { Controller, Get } from '@nestjs/common';
import { AllHomesDto } from './dtos/home.dto';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) { }
  @Get()
  getAllHomes(): Promise<AllHomesDto[]> {
    return this.homeService.getAllHomes();
  }
}
