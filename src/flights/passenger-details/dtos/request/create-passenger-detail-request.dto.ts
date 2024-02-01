import { Transform } from 'class-transformer';

import { AutoMap } from '@automapper/classes';

const SPACE = ' ';
const pascalize = (word: string) => {
  return word
    ? word
        .trim()
        .split(SPACE)
        .map((word) =>
          (
            word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()
          ).trim(),
        )
        .join(SPACE)
    : word;
};

export class CreatePassengerDetailRequestDto {
  @AutoMap()
  @Transform(({ value }) => pascalize(value))
  firstName?: string;

  @AutoMap()
  @Transform(({ value }) => pascalize(value))
  lastName?: string;

  @AutoMap()
  @Transform(({ value }) => pascalize(value))
  middleName?: string;

  @AutoMap()
  @Transform(({ value }) => pascalize(value))
  title?: string;

  @AutoMap()
  @Transform(({ value }) => (value ? `${value}`?.toUpperCase() : value))
  nationality?: string;

  @AutoMap()
  birthDate?: string;

  @AutoMap()
  @Transform(({ value }) => (value ? `${value}`?.toUpperCase() : value))
  passportNumber?: string;

  @AutoMap()
  expirationDate?: string;

  @AutoMap()
  countryIssued?: string;
}
