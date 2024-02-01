import { Transform } from 'class-transformer';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import * as moment from 'moment';

import { AutoMap } from '@automapper/classes';

import { FlightProvider } from '../../../../common/enums/flight-provider.enum';
import { CustomerDetailBookingRequestDto } from './customer-detail-booking-request.dto';
import { PassengerDetailBookingRequestDto } from './passenger-detail-booking-request.dto';
import { PaymentFlightDetailBookingRequestDto } from './payment-flight-detail-booking-request.dto';

const DATE_FORMAT = 'YYYY-MM-DD';
const YEARS = 'years';

@ValidatorConstraint({ name: 'isPassengerTypeValid' })
class IsPassengerTypeValid implements ValidatorConstraintInterface {
  validate(passengerDetails: PassengerDetailBookingRequestDto[]): boolean {
    for (const passengerDetail of passengerDetails) {
      const { birthDate, passengerType } = passengerDetail;
      const passengerBirthDate = moment(moment(birthDate).format(DATE_FORMAT));
      const dateNow = moment(moment().format(DATE_FORMAT));
      const passengerAge = dateNow.diff(passengerBirthDate, YEARS);
      if (passengerAge <= 12 && passengerType === 'ADT') return false;
      if (
        passengerAge > 12 &&
        (passengerType === 'CHD' || passengerType === 'INF')
      )
        return false;
    }
    return true;
  }
}

export class CreateBookingFlightRequestDto {
  @AutoMap()
  transactionId?: string;

  @AutoMap()
  flightReference?: string;

  @AutoMap()
  origin?: string;

  @AutoMap()
  destination?: string;

  @AutoMap()
  departureDate?: Date;

  @Transform(({ value }) => parseInt(value))
  @AutoMap()
  adults?: number;

  @Transform(({ value }) => parseInt(value))
  @AutoMap()
  children?: number;

  @Transform(({ value }) => parseInt(value))
  @AutoMap()
  infants?: number;

  @AutoMap()
  cabinClass?: string;

  @Transform(({ value }) =>
    `${value}` === '765J' ? FlightProvider.Mystifly : `${value}`.toLowerCase(),
  )
  @AutoMap()
  provider?: FlightProvider;

  providerDetails?: any;

  customerDetails?: CustomerDetailBookingRequestDto;

  paymentFlightDetails?: PaymentFlightDetailBookingRequestDto;

  // @Validate(IsPassengerTypeValid, {
  //   message: 'Passenger birthdate and type should match!',
  // })
  passengerDetails?: PassengerDetailBookingRequestDto[];
}
