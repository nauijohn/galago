import { FlightType } from '../../../common/enums/flight-type.enum';

export interface IFlightBookingInfoDetail {
  fromAndToWithArrow: string;
  totalFlightDuration: string;
  origin: string;
  originAirportAndTerminal: string;
  departureTime: string;
  departureDate: string;
  destination: string;
  destinationAirportAndTerminal: string;
  arrivalTime: string;
  arrivalDate: string;
  carrier: string;
  flightNumber: string;
  cabinClass: string;
}

export interface IFlightBookingInfoDetailOneWay
  extends IFlightBookingInfoDetail {
  airlineRef: string;
  bookingStatus: string;
}

export interface IFlightBookingInfoDetailRoundtrip {
  airlineRef: string;
  bookingStatus: string;
  departureDetails: IFlightBookingInfoDetail;
  returnDetails: IFlightBookingInfoDetail;
}

export interface IFlightBookingInfo {
  details:
    | IFlightBookingInfoDetailOneWay[]
    | IFlightBookingInfoDetailRoundtrip[];
  generalDetail: {
    to: string;
    bookingNumber: string;
    passengerDetails: {
      name: string;
      type: string;
      cabinBaggage: string;
      checkinBaggage: string;
    }[];
  };
  totalPrices: {
    baseFare: string;
    taxes: string;
    totalTaxesAndFees: string;
    grandTotal: string;
  };
}

export interface IFlightEmailInfo {
  flightType: FlightType;
  flightBookingInfo: IFlightBookingInfo;
}
