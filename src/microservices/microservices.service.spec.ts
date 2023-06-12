import { Test, TestingModule } from '@nestjs/testing';
import { MicroservicesService } from './microservices.service';

describe('MicroservicesService', () => {
  let service: MicroservicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MicroservicesService],
    }).compile();

    service = module.get<MicroservicesService>(MicroservicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
