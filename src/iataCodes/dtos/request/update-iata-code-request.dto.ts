import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

import { CreateIataCodeRequestDto } from './create-iata-code-request.dto';

export class UpdateIataCodeRequestDto extends CreateIataCodeRequestDto {
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
