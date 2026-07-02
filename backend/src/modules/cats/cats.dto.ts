import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export class CreateMouseDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}

export class CreateCatDto {
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @ValidateIf((dto: CreateCatDto) => Boolean(dto.image))
  @IsUrl()
  @IsOptional()
  image?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMouseDto)
  @IsOptional()
  mice?: CreateMouseDto[];
}

export class UpdateCatDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @ValidateIf((dto: UpdateCatDto) => Boolean(dto.image))
  @IsUrl()
  @IsOptional()
  image?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMouseDto)
  @ArrayMinSize(0)
  @IsOptional()
  mice?: CreateMouseDto[];
}
