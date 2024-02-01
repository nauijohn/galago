import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

import { AutoMap } from '@automapper/classes';

import { TboHotelBookResponse } from '../../../../providers/tbo/hotel-book-responses/tbo-hotel-book-response.entity';
import { CreateBookingHotelRequestDto } from './create-booking-hotel-request.dto';

export class UpdateBookingHotelRequestDto extends CreateBookingHotelRequestDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  @AutoMap()
  id: number;

  @IsOptional()
  @AutoMap(() => TboHotelBookResponse)
  tboHotelBookResponse?: TboHotelBookResponse;

  @IsOptional()
  userId?: string;
}
