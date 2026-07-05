import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CatModel } from 'src/models/cat/cat.model';
import { MouseModel } from 'src/models/mouse/mouse.model';
import { CatsController } from 'src/modules/cats/cats.controller';
import { CatsService } from 'src/modules/cats/cats.service';

@Module({
  imports: [SequelizeModule.forFeature([CatModel, MouseModel])],
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
