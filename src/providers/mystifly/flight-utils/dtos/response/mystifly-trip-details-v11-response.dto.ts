class MystiflyReservationItem {
  ItemRPH: number;
  DepartureDateTime: string;
  ArrivalDateTime: string;
  StopQuantity: number;
  FlightNumber: string;
  ResBookDesigCode: string;
  JourneyDuration: string;
  AirlinePNR: string;
  NumberInParty: number;
  DepartureAirportLocationCode: string;
  DepartureTerminal: string;
  ArrivalAirportLocationCode: string;
  ArrivalTerminal: string;
  OperatingAirlineCode: string;
  AirEquipmentType: string;
  MarketingAirlineCode: string;
  Baggage: string;
  FlightStatus: string;
  IsReturn: boolean;
  CabinClass: string;
  CabinClassType: string;
  FareFamily: string;
}

class MystiflyItineraryInfo {
  ReservationItems: MystiflyReservationItem[];
}

class MystiflyItinerary {
  ItineraryInfo: MystiflyItineraryInfo;
  Type: string;
}

class MystiflyAirVoidCharges {
  IsVoidable: string;
  PassengerType: string;
  AdminCharges: number;
  Currency: string;
  VoidingFee: number;
}

class MystiflyExchangeCharge {
  ChargeBeforeDeparture: number;
  HoursBeforeDeparture: number;
  PassengerType: string;
  AdminCharges: number;
  Currency: string;
}

class MystiflyAirExchangeCharges {
  IsExchangeableBeforeDeparture: string;
  IsExchangeableAfterDeparture: string;
  ExchangeCharges: MystiflyExchangeCharge[];
}

class MystiflyChargesBeforeDeparture {
  HoursBeforeDeparture: number;
  Charges: number;
}

class MystiflyRefundCharge {
  ChargesBeforeDeparture: MystiflyChargesBeforeDeparture[];
  PassengerType: string;
  AdminCharges: number;
  OtherTaxesK3: number;
  Currency: string;
}

class MystiflyAirRefundCharges {
  IsRefundableBeforeDeparture: string;
  IsRefundableAfterDeparture: string;
  RefundCharges: MystiflyRefundCharge[];
}

class MystiflyPassengerTypeQuantity {
  Code: string;
  Quantity: number;
}

class MystiflyFare {
  Amount: string;
  CurrencyCode: string;
  DecimalPlaces: number;
}

class MystiflyTripDetailsPassengerFare {
  EquiFare: MystiflyFare;
  Tax: MystiflyFare;
  TotalFare: MystiflyFare;
  AirportTaxBreakUp: string;
}

class MystiflyTripDetailsPTC_FareBreakdown {
  PassengerTypeQuantity: MystiflyPassengerTypeQuantity;
  TripDetailsPassengerFare: MystiflyTripDetailsPassengerFare;
  BaggageInfo: string[];
  CabinBaggageInfo: string[];
  IsPenaltyDetailsAvailable: boolean;
  AirRefundCharges: MystiflyAirRefundCharges;
  AirExchangeCharges: MystiflyAirExchangeCharges;
  AirVoidCharges: MystiflyAirVoidCharges;
}

class MystiflyPaxName {
  PassengerTitle: string;
  PassengerFirstName: string;
  PassengerLastName: string;
}

class MystiflyPassenger {
  Gender: string;
  DateOfBirth: string;
  EmailAddress: string;
  PassportExpiresOn: string;
  PassportNationality: string;
  PassengerNationality: string;
  PassportIssuanceCountry: string;
  PassengerType: string;
  PaxName: MystiflyPaxName;
  PassportNumber: string;
  NationalID: string;
  NameNumber: number;
}

class MystiflyPassengerInfo {
  Passenger: MystiflyPassenger;
}

class MystiflyTravelItinerary {
  MFRef: string;
  TripType: string;
  BookingStatus: string;
  Origin: string;
  Destination: string;
  FareType: string;
  PassengerInfos: MystiflyPassengerInfo[];
  TripDetailsPTC_FareBreakdowns: MystiflyTripDetailsPTC_FareBreakdown[];
  ClientUTCOffset: number;
  Itineraries: MystiflyItinerary[];
  TransactionDetails: unknown;
  BookingNotes: unknown[];
  TicketingTimeLimit: string;
  BookingMode: number;
  ReroutingAllowed: string;
  SpoilageFee: number;
}

class MystiflyTripDetailsResult {
  Provider: string;
  Success: boolean;
  TravelItinerary: MystiflyTravelItinerary;
  BookingCreatedOn: string;
}

class MystiflyTripDetailsV11Data {
  TripDetailsResult: MystiflyTripDetailsResult;
  PTRDetail: Array<unknown>;
}

export class MystiflyTripDetailsV11ResponseDto {
  Success: boolean;
  Data: MystiflyTripDetailsV11Data;
}
