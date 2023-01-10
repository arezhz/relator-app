import { Test, TestingModule } from '@nestjs/testing';
import { HomeService } from './home.service';
import { ConnectionService } from '../connection/connection.service';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';

describe('HomeService', () => {
  let service: HomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConnectionService, HomeService],
    }).compile();

    service = module.get<HomeService>(HomeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('get not found exceptions', async () => {
    const data = service.getHome(80);
    await expect(data).rejects.toThrow(NotFoundException);
  });
});
