import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { CatModel } from 'src/models/cat/cat.model';
import { MouseModel } from 'src/models/mouse/mouse.model';
import { CatsService } from 'src/modules/cats/cats.service';

describe('CatsService', () => {
  let service: CatsService;

  const catModelMock = {
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  };

  const mouseModelMock = {
    bulkCreate: jest.fn(),
    destroy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatsService,
        {
          provide: getModelToken(CatModel),
          useValue: catModelMock,
        },
        {
          provide: getModelToken(MouseModel),
          useValue: mouseModelMock,
        },
      ],
    }).compile();

    service = module.get<CatsService>(CatsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
