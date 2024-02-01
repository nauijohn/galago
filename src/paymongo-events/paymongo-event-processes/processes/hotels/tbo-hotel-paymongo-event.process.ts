import * as moment from 'moment';

import { BookingHotel } from '../../../../bookings/booking-hotels/booking-hotel.entity';
import { BookingHotelsService } from '../../../../bookings/booking-hotels/booking-hotels.service';
import { BookHotelsCustomerName } from '../../../../hotels/dtos/request/book-hotels-request.dto';
import { HotelsService } from '../../../../hotels/hotels.service';
import { NestMailerService } from '../../../../nest-mailer/nest-mailer.service';
import { TboHotelBookResponse } from '../../../../providers/tbo/hotel-book-responses/tbo-hotel-book-response.entity';
import { TboHotelBookResponsesService } from '../../../../providers/tbo/hotel-book-responses/tbo-hotel-book-responses.service';
import { TransactionHotel } from '../../../../transactions/hotels/transaction-hotel.entity';
import { UtilsService } from '../../../../utils/utils.service';
import { AbstractProcessPaymongoEventDto } from '../../dtos/abstract-process-paymongo-event.dto';
import { PaymongoEventGateway } from '../../paymongo-event-gateway.abstract';

const DATE_FORMAT = 'YYYY-MM-DD';
const ROOM = 'room';
const ROOMS = 'rooms';
const NIGHT = 'night';
const NIGHTS = 'nights';

export class TboHotelsPaymongoEventProcess implements PaymongoEventGateway {
  constructor(
    private readonly hotelsService: HotelsService,
    private readonly tboHotelBookResponsesService: TboHotelBookResponsesService,
    private readonly bookingHotelsService: BookingHotelsService,
    private readonly nestMailerService: NestMailerService,
    private readonly utilsService: UtilsService, // private readonly paymongoEventsService: PaymongoEventsService,
  ) {}

  async processPaymongoEvent(
    processPaymongoEventDto: AbstractProcessPaymongoEventDto,
  ): Promise<void> {
    const { transactionHotel } = processPaymongoEventDto;
    await this.processTboHotels(transactionHotel);
  }

  async processTboHotels(transactionHotel: TransactionHotel) {
    const bookingHotels = await this.processTboHotelsBooking(transactionHotel);

    const emailNotifDetails = await this.processTboHotelsBookingInfo(
      bookingHotels,
      transactionHotel,
    );

    console.log('emailNotifDetails: ', emailNotifDetails);

    await this.nestMailerService.hotelsBookingConfirmation(emailNotifDetails);
  }

  private async processTboHotelsBooking(transactionHotel: TransactionHotel) {
    const { prebookingHotel, bookingHotels, paymentHotel, transactionId } =
      transactionHotel;
    return await Promise.all(
      bookingHotels.map(async (bookingHotel, index) => {
        const { customerHotelDetail } = bookingHotel;
        const { firstName, lastName } = customerHotelDetail;
        const customerNames: BookHotelsCustomerName[] = [];
        const adults = bookingHotel.tboHotelDetail.rooms[0].Adults;
        for (let i = 0; i < adults; i++) {
          customerNames.push({
            firstName,
            lastName,
            title: 'mr',
            type: 'adult',
          });
        }
        const totalFare = prebookingHotel.tboHotelPrebookResponses.find(
          (tboHotelPrebookResponse) =>
            tboHotelPrebookResponse.rooms[0].BookingCode ===
            bookingHotel.tboHotelDetail.rooms[0].BookingCode,
        ).rooms[0].TotalFare;

        console.log('totalFare: ', totalFare);

        const tboHotelBookResponseDto: any = await this.hotelsService
          .book({
            bookingCode: bookingHotel.tboHotelDetail.rooms[0].BookingCode,
            customerNames: customerNames,
            email: bookingHotel.customerHotelDetail.email,
            phoneNumber: bookingHotel.customerHotelDetail.mobileNumber,
            // totalFare: bookingHotel.tboHotelDetail.rooms[0].TotalFare,
            totalFare: prebookingHotel.tboHotelPrebookResponses.find(
              (tboHotelPrebookResponse) =>
                tboHotelPrebookResponse.rooms[0].BookingCode ===
                bookingHotel.tboHotelDetail.rooms[0].BookingCode,
            ).rooms[0].TotalFare,
            referenceNumber: `${transactionId}-${index}`,
          })
          .catch((err) => ({
            message: String(err.response?.message),
          }));

        let tboHotelBookResponse: TboHotelBookResponse;
        if (tboHotelBookResponseDto.message) {
          tboHotelBookResponse = await this.tboHotelBookResponsesService.create(
            {
              userId: transactionHotel.userId,
              message: tboHotelBookResponseDto.message,
              paymentReferenceNumber: paymentHotel.referenceNumber,
              providerReference: prebookingHotel.providerReference,
            },
          );
        } else {
          tboHotelBookResponse = await this.tboHotelBookResponsesService.create(
            {
              userId: transactionHotel.userId,
              clientReferenceId: tboHotelBookResponseDto.ClientReferenceId,
              confirmationNumber: tboHotelBookResponseDto.ConfirmationNumber,
              paymentReferenceNumber: paymentHotel.referenceNumber,
              providerReference: prebookingHotel.providerReference,
            },
          );
        }

        const updatedBookingHotel = await this.bookingHotelsService.update({
          id: bookingHotel.id,
          tboHotelBookResponse,
        });

        return await this.bookingHotelsService.fetchById(
          updatedBookingHotel.id,
        );
      }),
    );
  }

  private async processTboHotelsBookingInfo(
    bookingHotels: BookingHotel[],
    transactionHotel: TransactionHotel,
  ) {
    const to = bookingHotels[0].customerHotelDetail.email;
    const bookingNumber = transactionHotel.transactionId;
    const location = transactionHotel.location;
    const checkInDate = moment(bookingHotels[0].checkInDate).format(
      DATE_FORMAT,
    );
    const checkInTime = bookingHotels[0].tboHotelDetail.checkInTime;
    const checkOutDate = moment(bookingHotels[0].checkOutDate).format(
      DATE_FORMAT,
    );
    const checkOutTime = bookingHotels[0].tboHotelDetail.checkOutTime;
    const hotelAddress = bookingHotels[0].tboHotelDetail.address;
    const hotelName = bookingHotels[0].tboHotelDetail.hotelName;
    const hotelTel = bookingHotels[0].tboHotelDetail.phoneNumber;

    const nights = this.utilsService.determineNumberOfNights(
      checkInDate,
      checkOutDate,
    );

    const reservations = `${bookingHotels.length} ${
      bookingHotels.length === 1 ? ROOM : ROOMS
    } ${nights} ${nights === 1 ? NIGHT : NIGHTS}`;

    const roomTypes = bookingHotels
      .map((bookingHotel) => bookingHotel.tboHotelDetail.rooms[0].Name[0])
      .join(',');

    const { firstName, lastName } = bookingHotels[0].customerHotelDetail;

    const leadGuest = `${firstName} ${lastName}`;

    const benefits = bookingHotels[0].tboHotelDetail.hotelFacilities;

    const additionalGuest = null;
    const specialRequest = null;

    const dayRateRooms = bookingHotels.map((bookingHotel) => {
      const { DayRates } = bookingHotel.tboHotelDetail.rooms[0];
      const totalDayRates = DayRates[0].reduce(
        (acc, curr) => +curr.BasePrice + acc,
        0,
      );
      return totalDayRates;
    });

    const taxRooms = bookingHotels.map(
      (bookingHotel) => bookingHotel.tboHotelDetail.rooms[0].TotalTax,
    );

    const totalDayRateRoom = dayRateRooms.reduce((acc, curr) => curr + acc, 0);
    const surcharge = taxRooms.reduce((acc, curr) => curr + acc, 0);
    const roomXnight = `${bookingHotels.length} room(s) x ${nights} night(s)`;
    const totalCharge = totalDayRateRoom + surcharge;

    // const { paymentIntentId } = transactionHotel.paymentHotel;
    // const { data: paymongoEventData } =
    //   await this.paymongoEventsService.fetchCheckoutSessionTypeByPaymentIntentId(
    //     paymentIntentId,
    //   );
    // const paymentSource =
    //   paymongoEventData.attributes.payments[0].attributes.source;

    // console.log('paymentSource: ', paymentSource);

    return {
      to,
      bookingNumber,
      location,
      checkInDate,
      checkInTime,
      checkOutDate,
      checkOutTime,
      hotelAddress,
      hotelName,
      hotelTel,
      reservations,
      roomTypes,
      leadGuest,
      benefits,
      additionalGuest,
      specialRequest,
      totalDayRateRoom,
      surcharge,
      roomXnight,
      totalCharge,
      // paymentSource: paymentSource.type,
    };
  }
}
