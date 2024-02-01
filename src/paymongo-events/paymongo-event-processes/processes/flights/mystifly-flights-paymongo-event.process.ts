import * as moment from 'moment';

import { BookingFlight } from '../../../../bookings/booking-flights/booking-flight.entity';
import { BookingFlightsService } from '../../../../bookings/booking-flights/booking-flights.service';
import { FlightType } from '../../../../common/enums/flight-type.enum';
import { CustomerFlightDetail } from '../../../../customer-details/flights/customer-flight-detail.entity';
import { OneWayBookFlightsRequestDto } from '../../../../flights/one-way/dtos/request/one-way-book-flights-request.dto';
import { PassengerDetail } from '../../../../flights/passenger-details/passenger-detail.entity';
import { NestMailerService } from '../../../../nest-mailer/nest-mailer.service';
import { MystiflyFlightBookResponsesService } from '../../../../providers/mystifly/flight-book-responses/mystifly-flight-book-responses.service';
import { MystiflyFlightDetail } from '../../../../providers/mystifly/flight-details/mystifly-flight-detail.entity';
import { MystiflyFlightRevalidationResponse } from '../../../../providers/mystifly/flight-revalidation-responses/mystifly-flight-revalidation-response.entity';
import { MystiflyBookResponseDto } from '../../../../providers/mystifly/flight-utils/dtos/response/mystifly-book-response.dto';
import {
  LocationDetails,
  OriginDestinations,
} from '../../../../providers/mystifly/flight-utils/dtos/response/mystifly-search-response.dto';
import { MystiflyFlightUtilsService } from '../../../../providers/mystifly/flight-utils/mystifly-flight-utils.service';
import { TransactionFlight } from '../../../../transactions/flights/transaction-flight.entity';
import { MyLoggerService } from '../../../../utils/my-logger.service';
import { UtilsService } from '../../../../utils/utils.service';
import { AbstractProcessPaymongoEventDto } from '../../dtos/abstract-process-paymongo-event.dto';
import {
  IFlightBookingInfo,
  IFlightBookingInfoDetail,
  IFlightBookingInfoDetailOneWay,
  IFlightBookingInfoDetailRoundtrip,
  IFlightEmailInfo,
} from '../../interfaces/flight-email-info.interface';
import { PaymongoEventGateway } from '../../paymongo-event-gateway.abstract';

const YYYY_MM_DD = 'YYYY-MM-DD';
const DATE_BIRTH_FORMAT = 'YYYY-MM-DDTHH:mm:SS';
const DATE_FORMAT = 'ddd, MMMM DD, YYYY';
const ANY = 'Any';
const SECONDS = 'seconds';
const MEAL_MOML = 'Meal MOML';
const PENDING = 'Pending';
const CONFIRMED = 'Confirmed';
const N_A = 'N/A';
const NA = 'NA';
const Y = 'y';
const T = 'T';
const BLANK = '';
const PH = 'PH';
const WEBFARE = 'webfare';
const PUBLIC = 'public';
const PRIVATE = 'private';
const NON_STOP = '(Non-Stop)';
const STOPS = 'Stops';
const EN_US = 'en-US';

const CabinClassCode = {
  Y: 'Economy',
  C: 'Business',
  F: 'First',
  S: 'Premium Economy',
};

enum PassengerType {
  Adult = 'adult',
  Child = 'child',
  Infant = 'infant',
}
enum MystiflyPassengerType {
  Adult = 'ADT',
  Child = 'CHD',
  Infant = 'INF',
}
enum PassengerTitle {
  Mister = 'mister',
  Miss = 'miss',
  Mistress = 'mistress',
  Master = 'master',
}
enum MystiflyPassengerTitle {
  Mister = 'MR',
  Miss = 'MISS',
  Mistress = 'MISS',
  Master = 'MSTR',
}

enum MystiflyGenders {
  Male = 'M',
  Female = 'F',
  Unisex = 'U',
}

export class MystiflyFlightsPaymongoEventProcess
  implements PaymongoEventGateway
{
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly utilsService: UtilsService,
    private readonly nestMailerService: NestMailerService,
    private readonly bookingFlightsService: BookingFlightsService,
    private readonly mystiflyFlightBookResponsesService: MystiflyFlightBookResponsesService,
    private readonly mystiflyFlightUtilsService: MystiflyFlightUtilsService,
  ) {}

  async processPaymongoEvent(
    processPaymongoEventDto: AbstractProcessPaymongoEventDto,
  ): Promise<void> {
    const { transactionFlight } = processPaymongoEventDto;
    await this.processMystiflyFlights(transactionFlight);
  }

  private async processMystiflyFlights(transactionFlight: TransactionFlight) {
    this.loggerService.log('processMystiflyFlights...');

    const bookingFlights = await this.processMystiflyFlightsBooking(
      transactionFlight,
    );
    const { flightBookingInfo, flightType } =
      await this.processMystiflyFlightBookingInfo(
        bookingFlights,
        transactionFlight.transactionId,
      );
    await this.processMystiflyFlightEmailBookingConfirmation(
      flightBookingInfo,
      flightType,
    );
  }

  private async processMystiflyFlightsBooking(
    transactionFlight: TransactionFlight,
  ) {
    this.loggerService.log('processMystiflyFlightsBooking...');

    const { prebookingFlight, bookingFlights, paymentFlight } =
      transactionFlight;
    const { mystiflyFlightRevalidationResponses } = prebookingFlight;

    const webFareMystiflyFlightRevalidationResponses =
      mystiflyFlightRevalidationResponses.filter(
        (mystiflyFlightRevalidationResponse) =>
          mystiflyFlightRevalidationResponse.pricedItineraries[0].AirItineraryPricingInfo.FareType.toLowerCase() ===
          WEBFARE,
      );

    const privateOrPublicMystiflyFlightRevalidationResponses =
      mystiflyFlightRevalidationResponses.filter(
        (mystiflyFlightRevalidationResponse) =>
          mystiflyFlightRevalidationResponse.pricedItineraries[0].AirItineraryPricingInfo.FareType.toLowerCase() ===
            PUBLIC ||
          mystiflyFlightRevalidationResponse.pricedItineraries[0].AirItineraryPricingInfo.FareType.toLowerCase() ===
            PRIVATE,
      );

    let oneWayBookFlightsResponses: MystiflyBookResponseDto[] = [];
    let sequences: number[] = [];
    let fareSourceCodes: string[] = [];

    if (webFareMystiflyFlightRevalidationResponses.length !== 0) {
      const {
        oneWayBookFlightsResponsesData,
        sequencesData,
        fareSourceCodesData,
      } = await this.mystiflyFlightBook(
        webFareMystiflyFlightRevalidationResponses,
        bookingFlights,
        WEBFARE,
      );
      oneWayBookFlightsResponses = [...oneWayBookFlightsResponsesData];
      sequences = [...sequencesData];
      fareSourceCodes = [...fareSourceCodesData];
    }

    if (privateOrPublicMystiflyFlightRevalidationResponses.length !== 0) {
      const {
        oneWayBookFlightsResponsesData,
        sequencesData,
        fareSourceCodesData,
      } = await this.mystiflyFlightBook(
        privateOrPublicMystiflyFlightRevalidationResponses,
        bookingFlights,
      );
      oneWayBookFlightsResponses =
        oneWayBookFlightsResponses.length !== 0
          ? [...oneWayBookFlightsResponses, ...oneWayBookFlightsResponsesData]
          : [...oneWayBookFlightsResponsesData];
      sequences =
        sequences.length !== 0
          ? [...sequences, ...sequencesData]
          : [...sequencesData];
      fareSourceCodes =
        fareSourceCodes.length !== 0
          ? [...fareSourceCodes, ...fareSourceCodesData]
          : [...fareSourceCodesData];
    }

    const updatedBookingFlights = await Promise.all(
      oneWayBookFlightsResponses.map(
        async (oneWayBookFlightsResponse, index) => {
          const {
            ClientUTCOffset,
            ConversationId,
            Errors,
            Status,
            TktTimeLimit,
            TraceId,
            UniqueID,
          } = oneWayBookFlightsResponse.Data;
          const bookingFlight = bookingFlights.find(
            (bookingFlight) => bookingFlight.sequence === sequences[index],
          );
          return this.bookingFlightsService.update({
            id: bookingFlight.id,
            mystiflyFlightBookResponse:
              await this.mystiflyFlightBookResponsesService.create({
                userId: bookingFlight.userId,
                ClientUTCOffset,
                ConversationId,
                Errors,
                sequence: sequences[index],
                Status,
                TktTimeLimit,
                TraceId,
                UniqueID,
                paymentReferenceNumber: paymentFlight.referenceNumber,
                providerReference: bookingFlight.providerReference,
                fareSourceCode: fareSourceCodes[index],
              }),
          });
        },
      ),
    );

    return Promise.all(
      updatedBookingFlights.map((updatedBookingFlight) =>
        this.bookingFlightsService.fetchById(updatedBookingFlight.id),
      ),
    );
  }

  private async processMystiflyFlightBookingInfo(
    bookingFlights: BookingFlight[],
    transactionId: string,
  ): Promise<IFlightEmailInfo> {
    const bookingFlightsSortedBySequence = bookingFlights.sort(
      (a, b) => a.sequence - b.sequence,
    );

    const flightTypes = bookingFlights.map(
      (bookingFlight) => bookingFlight.flightType,
    );

    let flightType: FlightType;
    let details:
      | IFlightBookingInfoDetailOneWay[]
      | IFlightBookingInfoDetailRoundtrip[];

    if (flightTypes.length === 1) {
      const isRoundtrip = flightTypes.every(
        (flightType) => flightType === FlightType.Roundtrip,
      );
      const isOneWay = flightTypes.every(
        (flightType) => flightType === FlightType.OneWay,
      );

      if (isRoundtrip) {
        flightType = FlightType.Roundtrip;
        details = await Promise.all(
          bookingFlightsSortedBySequence.map((bookingFlight) =>
            this.processMystiflyFlightEmailDetailsRoundtripV2(bookingFlight),
          ),
        );
      }

      if (isOneWay) {
        flightType = FlightType.OneWay;
        details = await Promise.all(
          bookingFlightsSortedBySequence.map((bookingFlight) =>
            this.processMystiflyFlightEmailDetails(bookingFlight),
          ),
        );
      }
    }

    const totalPrices = bookingFlightsSortedBySequence.map((bookingFlight) =>
      this.processMystiflyFlightEmailDetailPrices(bookingFlight),
    );

    return {
      flightType,
      flightBookingInfo: {
        details,
        generalDetail: this.processMystiflyFlightGeneralEmailDetails(
          transactionId,
          bookingFlightsSortedBySequence,
        ),
        totalPrices: {
          baseFare: totalPrices
            .reduce((a, b) => a + Number(b.baseFare), 0)
            .toLocaleString(EN_US, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
          taxes: totalPrices
            .reduce((a, b) => a + Number(b.totalTaxesAndFees), 0)
            .toLocaleString(EN_US, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
          totalTaxesAndFees: totalPrices
            .reduce((a, b) => a + Number(b.grandTotal), 0)
            .toLocaleString(EN_US, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
          grandTotal: totalPrices
            .reduce((a, b) => a + Number(b.grandTotal), 0)
            .toLocaleString(EN_US, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
        },
      },
    };
  }

  private async processMystiflyFlightEmailBookingConfirmation(
    flightBookingInfo: IFlightBookingInfo,
    flightType?: FlightType,
  ) {
    this.loggerService.log('processMystiflyFlightEmailBookingConfirmation...');

    const { to, bookingNumber, passengerDetails } =
      flightBookingInfo.generalDetail;
    const { baseFare, grandTotal, taxes, totalTaxesAndFees } =
      flightBookingInfo.totalPrices;

    switch (flightType) {
      case FlightType.OneWay || FlightType.RoundtripOld: {
        switch (flightBookingInfo.details.length) {
          case 1: {
            const {
              airlineRef,
              arrivalDate,
              arrivalTime,
              bookingStatus,
              cabinClass,
              carrier,
              departureDate,
              departureTime,
              destination,
              destinationAirportAndTerminal,
              fromAndToWithArrow,
              flightNumber,
              origin,
              originAirportAndTerminal,
              totalFlightDuration,
            } = flightBookingInfo.details[0] as IFlightBookingInfoDetailOneWay;
            await this.nestMailerService.flightsOneWayBookingConfirmation({
              to,
              airlineRef,
              bookingStatus,
              bookingNumber,
              fromAndToWithArrow,
              totalFlightDuration,
              origin,
              originAirportAndTerminal,
              departureTime,
              departureDate,
              destination,
              destinationAirportAndTerminal,
              arrivalTime,
              arrivalDate,
              carrier,
              flightNumber,
              cabinClass,
              passengerDetails,
              baseFare,
              taxes,
              totalTaxesAndFees,
              grandTotal,
            });
            break;
          }
          case 2: {
            let airlineRef = BLANK;
            if (
              flightBookingInfo.details[0].airlineRef &&
              flightBookingInfo.details[1].airlineRef
            )
              airlineRef = `${flightBookingInfo.details[0].airlineRef} / ${flightBookingInfo.details[1].airlineRef}`;
            let bookingStatus = PENDING;
            if (
              flightBookingInfo.details[0].bookingStatus === CONFIRMED &&
              flightBookingInfo.details[1].bookingStatus === CONFIRMED
            )
              bookingStatus = CONFIRMED;

            const flightBookingInfoDetailsDeparture = flightBookingInfo
              .details[0] as IFlightBookingInfoDetailOneWay;
            const flightBookingInfoDetailsReturn = flightBookingInfo
              .details[1] as IFlightBookingInfoDetailOneWay;

            await this.nestMailerService.flightsRoundtripBookingConfirmation({
              to,
              airlineRef,
              bookingStatus,
              passengerDetails,
              bookingNumber,
              departureDetails: {
                arrivalDate: flightBookingInfoDetailsDeparture.arrivalDate,
                arrivalTime: flightBookingInfoDetailsDeparture.arrivalTime,
                cabinClass: flightBookingInfoDetailsDeparture.cabinClass,
                carrier: flightBookingInfoDetailsDeparture.carrier,
                departureDate: flightBookingInfoDetailsDeparture.departureDate,
                departureTime: flightBookingInfoDetailsDeparture.departureTime,
                destination: flightBookingInfoDetailsDeparture.destination,
                destinationAirportAndTerminal:
                  flightBookingInfoDetailsDeparture.destinationAirportAndTerminal,
                fromAndToWithArrow:
                  flightBookingInfoDetailsDeparture.fromAndToWithArrow,
                flightNumber: flightBookingInfoDetailsDeparture.flightNumber,
                origin: flightBookingInfoDetailsDeparture.origin,
                originAirportAndTerminal:
                  flightBookingInfoDetailsDeparture.originAirportAndTerminal,
                totalFlightDuration:
                  flightBookingInfoDetailsDeparture.totalFlightDuration,
              },
              returnDetails: {
                arrivalDate: flightBookingInfoDetailsReturn.arrivalDate,
                arrivalTime: flightBookingInfoDetailsReturn.arrivalTime,
                cabinClass: flightBookingInfoDetailsReturn.cabinClass,
                carrier: flightBookingInfoDetailsReturn.carrier,
                departureDate: flightBookingInfoDetailsReturn.departureDate,
                departureTime: flightBookingInfoDetailsReturn.departureTime,
                destination: flightBookingInfoDetailsReturn.destination,
                destinationAirportAndTerminal:
                  flightBookingInfoDetailsReturn.destinationAirportAndTerminal,
                fromAndToWithArrow:
                  flightBookingInfoDetailsReturn.fromAndToWithArrow,
                flightNumber: flightBookingInfoDetailsReturn.flightNumber,
                origin: flightBookingInfoDetailsReturn.origin,
                originAirportAndTerminal:
                  flightBookingInfoDetailsReturn.originAirportAndTerminal,
                totalFlightDuration:
                  flightBookingInfoDetailsReturn.totalFlightDuration,
              },
              baseFare,
              taxes,
              totalTaxesAndFees,
              grandTotal,
            });
            break;
          }
          default: {
            this.loggerService.verbose('default case...');
            break;
          }
        }
        break;
      }

      case FlightType.Roundtrip: {
        const details =
          flightBookingInfo.details as IFlightBookingInfoDetailRoundtrip[];

        const { departureDetails, returnDetails, airlineRef, bookingStatus } =
          details[0];

        const unwrapDetails = (details: IFlightBookingInfoDetail) => ({
          arrivalDate: details.arrivalDate,
          arrivalTime: details.arrivalTime,
          cabinClass: details.cabinClass,
          carrier: details.carrier,
          departureDate: details.departureDate,
          departureTime: details.departureTime,
          destination: details.destination,
          destinationAirportAndTerminal: details.destinationAirportAndTerminal,
          fromAndToWithArrow: details.fromAndToWithArrow,
          flightNumber: details.flightNumber,
          origin: details.origin,
          originAirportAndTerminal: details.originAirportAndTerminal,
          totalFlightDuration: details.totalFlightDuration,
        });

        await this.nestMailerService.flightsRoundtripBookingConfirmation({
          to,
          airlineRef,
          bookingStatus,
          passengerDetails,
          bookingNumber,
          departureDetails: unwrapDetails(departureDetails),
          returnDetails: unwrapDetails(returnDetails),
          baseFare,
          taxes,
          totalTaxesAndFees,
          grandTotal,
        });
        break;
      }
    }
  }

  private async mystiflyFlightBook(
    mystiflyFlightRevalidationResponse: MystiflyFlightRevalidationResponse[],
    bookingFlights: BookingFlight[],
    fareType?: string,
  ) {
    const { passengerDetails, customerFlightDetail } = bookingFlights[0];

    const mystiflyFlightRevalidationResponsesSortedBySequence =
      mystiflyFlightRevalidationResponse.sort(
        (a, b) => a.sequence - b.sequence,
      );

    const sequences = mystiflyFlightRevalidationResponsesSortedBySequence.map(
      (mystiflyFlightRevalidationResponse) =>
        mystiflyFlightRevalidationResponse.sequence,
    );

    const fareSourceCodes =
      mystiflyFlightRevalidationResponsesSortedBySequence.map(
        (mystiflyFlightRevalidationResponse) =>
          mystiflyFlightRevalidationResponse.pricedItineraries[0]
            .AirItineraryPricingInfo.FareSourceCode,
      );

    const oneWayBookFlightsRequestDtos =
      mystiflyFlightRevalidationResponsesSortedBySequence.map(
        (mystiflyFlightRevalidationResponse) =>
          this.constructMystiflyOneWayBookRequest(
            mystiflyFlightRevalidationResponse,
            passengerDetails,
            customerFlightDetail,
            bookingFlights.find(
              (bookingFlight) =>
                bookingFlight.sequence ===
                mystiflyFlightRevalidationResponse.sequence,
            ).mystiflyFlightDetail,
          ),
      );

    oneWayBookFlightsRequestDtos.forEach((oneWayBookFlightsRequestDto) => {
      console.log(
        'oneWayBookFlightsRequestDto: ',
        JSON.stringify(oneWayBookFlightsRequestDto, null, 2),
      );
    });

    const oneWayBookFlightsResponses = await Promise.all(
      oneWayBookFlightsRequestDtos.map((oneWayBookFlightsRequestDto) =>
        this.mystiflyFlightUtilsService.book(oneWayBookFlightsRequestDto),
      ),
    );

    if (fareType?.toLowerCase() !== WEBFARE) {
      const x = await Promise.all(
        oneWayBookFlightsResponses.map((oneWayBookFlightsResponse) => {
          const { UniqueID, Success } = oneWayBookFlightsResponse.Data;
          if (Success)
            return this.mystiflyFlightUtilsService.orderTicket({ UniqueID });
        }),
      );
    }

    return {
      oneWayBookFlightsResponsesData: oneWayBookFlightsResponses,
      sequencesData: sequences,
      fareSourceCodesData: fareSourceCodes,
    };
  }

  private async processMystiflyFlightEmailDetails(
    bookingFlight: BookingFlight,
  ) {
    this.loggerService.log('processMystiflyFlightEmailDetails...');

    const { mystiflyFlightDetail, mystiflyFlightBookResponse } = bookingFlight;
    const { originDestinations } = mystiflyFlightDetail;
    const {
      DepartureLocationDetails,
      DepartureDateTime,
      OperatingCarrierDetails,
      OperatingCarrierCode,
      OperatingFlightNumber,
    } = originDestinations[0].FlightSegment;
    const { CabinClassType, CabinClassCode } =
      originDestinations[0].ItineraryReference;

    let airlineRef = BLANK;
    let bookingStatus = PENDING;
    console.log(
      'mystiflyFlightBookResponse.uniqueID: ',
      mystiflyFlightBookResponse.uniqueID,
    );
    if (
      mystiflyFlightBookResponse.uniqueID &&
      mystiflyFlightBookResponse.uniqueID !== BLANK
    ) {
      bookingStatus = CONFIRMED;
      const tripDetails = await this.mystiflyFlightUtilsService.tripDetailsV11(
        mystiflyFlightBookResponse.uniqueID,
      );
      console.log('tripDetails: ', tripDetails);
      this.loggerService.debug('tripDetails: ', tripDetails);
      if (tripDetails.Data) {
        const tripDetailsItineraries =
          tripDetails.Data.TripDetailsResult.TravelItinerary.Itineraries;
        console.log('tripDetailsItineraries: ', tripDetailsItineraries);
        const airlinePnrs = tripDetailsItineraries.map(
          (tripDetailsItinerary) =>
            tripDetailsItinerary.ItineraryInfo.ReservationItems[0].AirlinePNR,
        );
        airlineRef = airlinePnrs.length === 0 ? null : airlinePnrs.join('-');
      }
    }

    let arrivalLocationDetails: LocationDetails;
    let arrivalDateTime = BLANK;
    let stops = BLANK;
    if (originDestinations.length === 1) {
      const { ArrivalLocationDetails, ArrivalDateTime } =
        originDestinations[0].FlightSegment;
      arrivalLocationDetails = ArrivalLocationDetails;
      arrivalDateTime = String(ArrivalDateTime);
      stops = NON_STOP;
    } else {
      const { ArrivalLocationDetails, ArrivalDateTime } =
        originDestinations[originDestinations.length - 1].FlightSegment;
      arrivalLocationDetails = ArrivalLocationDetails;
      arrivalDateTime = String(ArrivalDateTime);
      stops = `(${originDestinations.length} ${STOPS})`;
    }
    const departureLocationDetails = DepartureLocationDetails;
    const departureDateTime = String(DepartureDateTime);
    const carrier = OperatingCarrierDetails?.descriptions ?? BLANK;
    const flightNumber = `${OperatingCarrierCode} ${OperatingFlightNumber}`;
    const cabinClass = `${this.determineCabinClassByCode(
      CabinClassCode,
    )} (${CabinClassCode})`;
    const fromAndToWithArrow = `${departureLocationDetails.cityCode} (${departureLocationDetails.cityName})  →  ${arrivalLocationDetails.cityCode} (${arrivalLocationDetails.cityName})`;
    const origin = `${departureLocationDetails.cityCode} (${departureLocationDetails.cityName}, ${departureLocationDetails.countryName})`;
    const originAirportAndTerminal = departureLocationDetails.airportName;
    const departureTime = departureDateTime.split(T)[1];
    const departureDate = moment(departureDateTime.split(T)[0]).format(
      DATE_FORMAT,
    );
    const destination = `${arrivalLocationDetails.cityCode} (${arrivalLocationDetails.cityName}, ${arrivalLocationDetails.countryName})`;
    const destinationAirportAndTerminal = arrivalLocationDetails.airportName;
    const arrivalTime = arrivalDateTime.split(T)[1];
    const arrivalDate = moment(arrivalDateTime.split(T)[0]).format(DATE_FORMAT);
    const firstDate = moment(arrivalDateTime);
    const secondDate = moment(departureDateTime);

    console.log('departureDateTime: ', departureDateTime);
    console.log('departureTime: ', departureTime);
    console.log('departureDate: ', departureDate);
    console.log('arrivalDateTime: ', arrivalDateTime);
    console.log('arrivalTime: ', arrivalTime);
    console.log('arrivalDate: ', arrivalDate);
    console.log('firstDate: ', firstDate);
    console.log('secondDate: ', secondDate);
    console.log(
      'firstDate.diff(secondDate, SECONDS): ',
      firstDate.diff(secondDate, SECONDS),
    );
    const totalFlightDuration = `${this.utilsService.timeForHumans(
      firstDate.diff(secondDate, SECONDS),
    )} ${stops}`;

    return {
      airlineRef: airlineRef === BLANK ? null : airlineRef,
      bookingStatus,
      fromAndToWithArrow,
      totalFlightDuration,
      origin,
      originAirportAndTerminal,
      departureTime,
      departureDate,
      destination,
      destinationAirportAndTerminal,
      arrivalTime,
      arrivalDate,
      carrier,
      flightNumber,
      cabinClass,
    };
  }

  private async processMystiflyFlightEmailDetailsRoundtripV2(
    bookingFlight: BookingFlight,
  ) {
    this.loggerService.log('processMystiflyFlightEmailDetailsRoundtripV2...');

    const { mystiflyFlightDetail, mystiflyFlightBookResponse } = bookingFlight;
    const { originDestinations } = mystiflyFlightDetail;

    let airlineRef = BLANK;
    let bookingStatus = PENDING;
    console.log(
      'mystiflyFlightBookResponse.uniqueID: ',
      mystiflyFlightBookResponse.uniqueID,
    );
    if (
      mystiflyFlightBookResponse.uniqueID &&
      mystiflyFlightBookResponse.uniqueID !== BLANK
    ) {
      bookingStatus = CONFIRMED;
      const tripDetails = await this.mystiflyFlightUtilsService.tripDetailsV11(
        mystiflyFlightBookResponse.uniqueID,
      );
      console.log('tripDetails: ', tripDetails);
      this.loggerService.debug('tripDetails: ', tripDetails);
      if (tripDetails.Data) {
        const tripDetailsItineraries =
          tripDetails.Data.TripDetailsResult.TravelItinerary.Itineraries;
        console.log('tripDetailsItineraries: ', tripDetailsItineraries);
        const airlinePnrs = tripDetailsItineraries.map(
          (tripDetailsItinerary) =>
            tripDetailsItinerary.ItineraryInfo.ReservationItems[0].AirlinePNR,
        );
        airlineRef = airlinePnrs.length === 0 ? null : airlinePnrs.join('-');
      }
    }

    const departureOriginDestinations: OriginDestinations[] = [];
    const returnOriginDestinations: OriginDestinations[] = [];

    originDestinations.forEach((originDestination, index) => {
      if ((index + 1) / originDestinations.length <= 0.5)
        return departureOriginDestinations.push(originDestination);
      return returnOriginDestinations.push(originDestination);
    });

    return {
      airlineRef: airlineRef === BLANK ? null : airlineRef,
      bookingStatus,
      departureDetails: this.parseMystiflyOriginDestinations(
        departureOriginDestinations,
      ),
      returnDetails: this.parseMystiflyOriginDestinations(
        returnOriginDestinations,
      ),
    };
  }

  private processMystiflyFlightEmailDetailPrices(bookingFlight: BookingFlight) {
    this.loggerService.log('processMystiflyFlightEmailDetails...');

    const { mystiflyFlightDetail } = bookingFlight;
    const { BaseFare, TotalFare, Quantity } =
      mystiflyFlightDetail.flightFares.PassengerFare[0];

    const grandTotal = Number(TotalFare);
    const baseFare = Number(BaseFare);
    const taxes = Number(TotalFare) - baseFare;
    const totalTaxesAndFees = grandTotal - (taxes + baseFare) + taxes;
    const quantity = Number(Quantity);

    return {
      baseFare: (baseFare * quantity).toFixed(2),
      taxes: (taxes * quantity).toFixed(2),
      totalTaxesAndFees: (totalTaxesAndFees * quantity).toFixed(2),
      grandTotal: grandTotal.toFixed(2),
    };
  }

  private parseMystiflyOriginDestinations(
    originDestinations: OriginDestinations[],
  ) {
    const {
      DepartureLocationDetails,
      DepartureDateTime,
      OperatingCarrierDetails,
      OperatingCarrierCode,
      OperatingFlightNumber,
    } = originDestinations[0].FlightSegment;
    const { CabinClassType, CabinClassCode } =
      originDestinations[0].ItineraryReference;

    let arrivalLocationDetails: LocationDetails;
    let arrivalDateTime = BLANK;
    let stops = BLANK;
    if (originDestinations.length === 1) {
      const { ArrivalLocationDetails, ArrivalDateTime } =
        originDestinations[0].FlightSegment;
      arrivalLocationDetails = ArrivalLocationDetails;
      arrivalDateTime = String(ArrivalDateTime);
      stops = NON_STOP;
    } else {
      const { ArrivalLocationDetails, ArrivalDateTime } =
        originDestinations[originDestinations.length - 1].FlightSegment;
      arrivalLocationDetails = ArrivalLocationDetails;
      arrivalDateTime = String(ArrivalDateTime);
      stops = `(${originDestinations.length} ${STOPS})`;
    }
    const departureLocationDetails = DepartureLocationDetails;
    const departureDateTime = String(DepartureDateTime);
    const carrier = OperatingCarrierDetails?.descriptions ?? BLANK;
    const flightNumber = `${OperatingCarrierCode} ${OperatingFlightNumber}`;
    const cabinClass = `${this.determineCabinClassByCode(
      CabinClassCode,
    )} (${CabinClassCode})`;
    const fromAndToWithArrow = `${departureLocationDetails.cityCode} (${departureLocationDetails.cityName})  →  ${arrivalLocationDetails.cityCode} (${arrivalLocationDetails.cityName})`;
    const origin = `${departureLocationDetails.cityCode} (${departureLocationDetails.cityName}, ${departureLocationDetails.countryName})`;
    const originAirportAndTerminal = departureLocationDetails.airportName;
    const departureTime = departureDateTime.split(T)[1];
    const departureDate = moment(departureDateTime.split(T)[0]).format(
      DATE_FORMAT,
    );
    const destination = `${arrivalLocationDetails.cityCode} (${arrivalLocationDetails.cityName}, ${arrivalLocationDetails.countryName})`;
    const destinationAirportAndTerminal = arrivalLocationDetails.airportName;
    const arrivalTime = arrivalDateTime.split(T)[1];
    const arrivalDate = moment(arrivalDateTime.split(T)[0]).format(DATE_FORMAT);
    const firstDate = moment(arrivalDateTime);
    const secondDate = moment(departureDateTime);

    console.log('departureDateTime: ', departureDateTime);
    console.log('departureTime: ', departureTime);
    console.log('departureDate: ', departureDate);
    console.log('arrivalDateTime: ', arrivalDateTime);
    console.log('arrivalTime: ', arrivalTime);
    console.log('arrivalDate: ', arrivalDate);
    console.log('firstDate: ', firstDate);
    console.log('secondDate: ', secondDate);
    console.log(
      'firstDate.diff(secondDate, SECONDS): ',
      firstDate.diff(secondDate, SECONDS),
    );
    const totalFlightDuration = `${this.utilsService.timeForHumans(
      firstDate.diff(secondDate, SECONDS),
    )} ${stops}`;

    return {
      fromAndToWithArrow,
      totalFlightDuration,
      origin,
      originAirportAndTerminal,
      departureTime,
      departureDate,
      destination,
      destinationAirportAndTerminal,
      arrivalTime,
      arrivalDate,
      carrier,
      flightNumber,
      cabinClass,
    };
  }

  private constructMystiflyOneWayBookRequest(
    mystiflyFlightRevalidationResponse: MystiflyFlightRevalidationResponse,
    passengerDetails: PassengerDetail[],
    customerFlightDetail: CustomerFlightDetail,
    mystiflyFlightDetail: MystiflyFlightDetail,
  ) {
    this.loggerService.log('constructMystiflyOneWayBookRequest...');

    passengerDetails.forEach((passengerDetail) =>
      console.log(
        'passengerDetail: ',
        JSON.stringify(passengerDetail, null, 2),
      ),
    );

    const [
      fareSourceCode,
      conversationId,
      flightSegments,
      isPassportMandatory,
      changeAllowed,
    ] = [
      mystiflyFlightRevalidationResponse.pricedItineraries[0]
        .AirItineraryPricingInfo.FareSourceCode,
      mystiflyFlightRevalidationResponse.conversationId,
      mystiflyFlightRevalidationResponse.pricedItineraries[0]
        .OriginDestinationOptions[0].FlightSegments,
      mystiflyFlightRevalidationResponse.pricedItineraries[0]
        .IsPassportMandatory,
      mystiflyFlightDetail.penaltiesInfo.Penaltydetails[0].ChangeAllowed,
    ];
    const oneWayBookFlightsRequestDto: OneWayBookFlightsRequestDto = {
      FareSourceCode: fareSourceCode,
      ConversationId: conversationId,
      TravelerInfo: {
        AirTravelers: passengerDetails.map((passengerDetail) => {
          passengerDetail.passengerType = this.determinePassengerType(
            passengerDetail.passengerType,
          );
          passengerDetail.title = this.determineTitle(passengerDetail.title);
          return {
            PassengerType: passengerDetail?.passengerType,
            Gender: this.determineGender(passengerDetail.title),
            PassengerName: {
              PassengerTitle: passengerDetail?.title?.toUpperCase(),
              PassengerFirstName: passengerDetail?.firstName?.toUpperCase(),
              PassengerLastName: passengerDetail?.lastName?.toUpperCase(),
            },
            DateOfBirth: moment(passengerDetail?.birthDate).format(
              DATE_BIRTH_FORMAT,
            ),
            Passport: isPassportMandatory
              ? {
                  PassportNumber:
                    this.utilsService.isNotUndefinedOrNullOrEmptyString(
                      passengerDetail?.passportNumber,
                    )
                      ? isPassportMandatory
                        ? passengerDetail?.passportNumber?.toUpperCase()
                        : NA
                      : NA,
                  ExpiryDate:
                    this.utilsService.isNotUndefinedOrNullOrEmptyString(
                      passengerDetail?.expirationDate,
                    )
                      ? isPassportMandatory
                        ? moment(passengerDetail?.expirationDate).format(
                            YYYY_MM_DD,
                          )
                        : moment().add(5, Y).format(YYYY_MM_DD)
                      : moment().add(5, Y).format(YYYY_MM_DD),
                  Country: isPassportMandatory
                    ? passengerDetail?.countryIssued
                      ? passengerDetail?.countryIssued
                      : PH
                    : PH,
                }
              : null,
            SpecialServiceRequest: {
              SeatPreference: ANY,
              MealPreference: ANY,
              RequestedSegments: flightSegments.map((flightSegment) => {
                const {
                  DepartureAirportLocationCode,
                  ArrivalAirportLocationCode,
                  OperatingAirline,
                  DepartureDateTime,
                } = flightSegment;
                return {
                  Origin: DepartureAirportLocationCode?.toUpperCase(),
                  Destination: ArrivalAirportLocationCode?.toUpperCase(),
                  FlightNumber:
                    `${OperatingAirline.Code}${OperatingAirline.FlightNumber}`?.toUpperCase(),
                  DepartureDateTime: DepartureDateTime,
                  RequestSSRs: [
                    {
                      SSRCode: ANY,
                      FreeText: MEAL_MOML,
                    },
                  ],
                };
              }),
            },
            PassengerNationality: passengerDetail?.countryIssued?.toUpperCase()
              ? passengerDetail?.countryIssued?.toUpperCase()
              : passengerDetail.nationality?.toUpperCase(),
            NationalID: passengerDetail?.countryIssued?.toUpperCase()
              ? passengerDetail?.countryIssued?.toUpperCase()
              : passengerDetail.nationality?.toUpperCase(),
          };
        }),
        AreaCode: N_A,
        CountryCode: changeAllowed
          ? customerFlightDetail.mobileNumber?.slice(2)
            ? customerFlightDetail.mobileNumber?.slice(0, 2)
            : customerFlightDetail.mobileNumber?.slice(0, 2)
          : N_A,
        Email: customerFlightDetail.email,
        PhoneNumber: changeAllowed
          ? customerFlightDetail.mobileNumber?.slice(2)
            ? customerFlightDetail.mobileNumber?.slice(2)
            : N_A
          : N_A,
        PostCode: N_A,
      },
    };

    return oneWayBookFlightsRequestDto;
  }

  private processMystiflyFlightGeneralEmailDetails(
    transactionId: string,
    bookingFlights: BookingFlight[],
  ) {
    this.loggerService.log('processMystiflyFlightGeneralEmailDetails...');

    const { mystiflyFlightDetail, passengerDetails, customerFlightDetail } =
      bookingFlights[0];
    const { originDestinations } = mystiflyFlightDetail;
    const { CabinBaggage, CheckinBaggage } =
      originDestinations[0].ItineraryReference;

    return {
      to: customerFlightDetail.email,
      bookingNumber: transactionId,
      passengerDetails: passengerDetails.map((passengerDetail) => ({
        name: `${passengerDetail.firstName} ${passengerDetail.lastName}`,
        type: passengerDetail.passengerType,
        cabinBaggage: CabinBaggage[0].Value,
        checkinBaggage: CheckinBaggage[0].Value,
        title: this.utilsService.pascalize(passengerDetail.title),
      })),
    };
  }

  private determinePassengerType(passengerType: string) {
    switch (passengerType?.toLowerCase()) {
      case PassengerType.Adult.toString().toLowerCase():
        return MystiflyPassengerType.Adult;
      case PassengerType.Child.toString().toLowerCase():
        return MystiflyPassengerType.Child;
      case PassengerType.Infant.toString().toLowerCase():
        return MystiflyPassengerType.Infant;
      default:
        console.log('passengerType: ', passengerType);
        return passengerType;
    }
  }

  private determineTitle(title: string) {
    switch (title?.toLowerCase()) {
      case PassengerTitle.Mister.toString().toLowerCase():
        return MystiflyPassengerTitle.Mister;
      case PassengerTitle.Miss.toString().toLowerCase():
        return MystiflyPassengerTitle.Miss;
      case PassengerTitle.Mistress.toString().toLowerCase():
        return MystiflyPassengerTitle.Mistress;
      case PassengerTitle.Master.toString().toLowerCase():
        return MystiflyPassengerTitle.Master;
    }
  }

  private determineGender(title: string) {
    switch (title?.toLowerCase()) {
      case MystiflyPassengerTitle.Mister.toString().toLowerCase():
        return MystiflyGenders.Male;
      case MystiflyPassengerTitle.Miss.toString().toLowerCase():
        return MystiflyGenders.Female;
      case MystiflyPassengerTitle.Mistress.toString().toLowerCase():
        return MystiflyGenders.Female;
      case MystiflyPassengerTitle.Master.toString().toLowerCase():
        return MystiflyGenders.Male;
      default:
        console.log('title: ', title);
        return MystiflyGenders.Unisex;
    }
  }

  private determineCabinClassByCode(code: string) {
    const isInKey = Object.keys(CabinClassCode).includes(code?.toUpperCase());
    return isInKey ? CabinClassCode[code] : '';
  }
}
