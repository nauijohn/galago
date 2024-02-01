import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

import { CreateCredentialRequestDto } from './create-credential-request.dto';

export class UpdateCredentialRequestDto extends CreateCredentialRequestDto {
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
