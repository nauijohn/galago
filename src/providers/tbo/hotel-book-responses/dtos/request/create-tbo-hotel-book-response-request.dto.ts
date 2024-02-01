import { IsOptional, IsString } from 'class-validator';

import { AutoMap } from '@automapper/classes';

export class CreateTboHotelBookResponseRequestDto {
  @IsOptional()
  @IsString()
  @AutoMap()
  userId?: string;

  @IsOptional()
  @IsString()
  @AutoMap()
  clientReferenceId?: string;

  @IsOptional()
  @IsString()
  @AutoMap()
  confirmationNumber?: string;

  @IsOptional()
  @IsString()
  @AutoMap()
  providerReference?: string;

  @IsOptional()
  @IsString()
  @AutoMap()
  paymentReferenceNumber?: string;

  @IsOptional()
  @IsString()
  @AutoMap()
  message?: string;
}
