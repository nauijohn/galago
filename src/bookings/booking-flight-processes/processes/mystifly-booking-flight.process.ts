import { FlightType } from '../../../common/enums/flight-type.enum';
import { MystiflyFlightDetailsService } from '../../../providers/mystifly/flight-details/mystifly-flight-details.service';
import { UpdateTransactionFlightRequestDto } from '../../../transactions/flights/dtos/request/update-transaction-flight-request.dto';
import { BookingFlightGateway } from '../booking-flight-gateway.abstract';
import { AbstractProcessFlightBookingDto } from '../dtos/abstract-process-flight-booking.dto';

export class MystiflyBookingFlightProcess implements BookingFlightGateway {
  constructor(
    private readonly mystiflyFlightDetailsService: MystiflyFlightDetailsService,
  ) {}

  async processFlightBooking(
    processFlightBookingDto: AbstractProcessFlightBookingDto,
  ) {
    const {
      flightType,
      providerDetails,
      transactionFlightId: id,
      paymentFlight,
      bookingFlight,
      bookingFlights,
    } = processFlightBookingDto;

    const updateTransactionFlightRequestDto: UpdateTransactionFlightRequestDto =
      {
        id,
        paymentFlight,
      };

    switch (flightType.toString()) {
      case FlightType.OneWay.toString(): {
        providerDetails.providerReference = bookingFlight.providerReference;
        providerDetails.paymentReferenceNumber = paymentFlight.referenceNumber;
        providerDetails.sequence = 1;

        bookingFlight.mystiflyFlightDetail =
          await this.mystiflyFlightDetailsService.create(providerDetails);

        updateTransactionFlightRequestDto.bookingFlights = [bookingFlight];
        return updateTransactionFlightRequestDto;
      }

      case FlightType.Roundtrip.toString(): {
        providerDetails.providerReference = bookingFlight.providerReference;
        providerDetails.paymentReferenceNumber = paymentFlight.referenceNumber;
        providerDetails.sequence = 1;

        bookingFlight.mystiflyFlightDetail =
          await this.mystiflyFlightDetailsService.create(providerDetails);

        updateTransactionFlightRequestDto.bookingFlights = [bookingFlight];
        return updateTransactionFlightRequestDto;
      }

      case FlightType.RoundtripOld.toString(): {
        const bookingFlightDeparture = bookingFlights.find(
          (bookingFlight) => bookingFlight.sequence === 1,
        );
        const bookingFlightReturn = bookingFlights.find(
          (bookingFlight) => bookingFlight.sequence === 2,
        );

        providerDetails.departureDetails.providerReference =
          bookingFlightDeparture.providerReference;
        providerDetails.departureDetails.paymentReferenceNumber =
          paymentFlight.referenceNumber;
        providerDetails.departureDetails.sequence = 1;

        providerDetails.returnDetails.providerReference =
          bookingFlightReturn.providerReference;
        providerDetails.returnDetails.paymentReferenceNumber =
          paymentFlight.referenceNumber;
        providerDetails.returnDetails.sequence = 2;

        const { departureDetails, returnDetails } = providerDetails;
        const [mystiflyFlightDetailDeparture, mystiflyFlightDetailReturn] =
          await Promise.all([
            this.mystiflyFlightDetailsService.create(departureDetails),
            this.mystiflyFlightDetailsService.create(returnDetails),
          ]);

        bookingFlightDeparture.mystiflyFlightDetail =
          mystiflyFlightDetailDeparture;
        bookingFlightReturn.mystiflyFlightDetail = mystiflyFlightDetailReturn;

        updateTransactionFlightRequestDto.bookingFlights = [
          bookingFlightDeparture,
          bookingFlightReturn,
        ];
        return updateTransactionFlightRequestDto;
      }
    }
  }
}
