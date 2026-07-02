import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private readonly nestConfigService: NestConfigService) {}

  get databaseHost(): string {
    return this.nestConfigService.get<string>('DATABASE_HOST', 'localhost');
  }

  get databasePort(): number {
    return Number(this.nestConfigService.get<string>('DATABASE_PORT', '5432'));
  }

  get databaseUsername(): string {
    return this.nestConfigService.get<string>('DATABASE_USERNAME', 'cats_user');
  }

  get databasePassword(): string {
    return this.nestConfigService.get<string>(
      'DATABASE_PASSWORD',
      'cats_password',
    );
  }

  get databaseName(): string {
    return this.nestConfigService.get<string>('DATABASE_NAME', 'cats_db');
  }
}
