import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { CommonModule } from 'src/common/common.module';
import { ConfigService } from 'src/common/services/config.service';
import { CatModel } from 'src/models/cat/cat.model';
import { MouseModel } from 'src/models/mouse/mouse.model';
import { CatsModule } from 'src/modules/cats/cats.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CommonModule,
    SequelizeModule.forRootAsync({
      imports: [CommonModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.databaseHost,
        port: configService.databasePort,
        username: configService.databaseUsername,
        password: configService.databasePassword,
        database: configService.databaseName,
        models: [CatModel, MouseModel],
        autoLoadModels: true,
        synchronize: true,
        logging: false,
      }),
    }),
    CatsModule,
  ],
})
export class AppModule {}
