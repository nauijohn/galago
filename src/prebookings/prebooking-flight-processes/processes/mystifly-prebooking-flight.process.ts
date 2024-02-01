import { FlightType } from '../../../common/enums/flight-type.enum';
import { MystiflyFlightFareRulesResponsesService } from '../../../providers/mystifly/flight-fare-rules-responses/mystifly-flight-fare-rules-responses.service';
import { MystiflyFlightRevalidationResponsesService } from '../../../providers/mystifly/flight-revalidation-responses/mystifly-flight-revalidation-responses.service';
import { UpdateTransactionFlightRequestDto } from '../../../transactions/flights/dtos/request/update-transaction-flight-request.dto';
import { AbstractProcessFlightPrebookingDto } from '../dtos/abstract-process-flight-prebooking.dto';
import { PrebookingFlightGateway } from '../prebooking-flight-gateway.abstract';

export class MystiflyPrebookingFlightProcess
  implements PrebookingFlightGateway
{
  constructor(
    private readonly mystiflyFlightFareRulesResponsesService: MystiflyFlightFareRulesResponsesService,
    private readonly mystiflyFlightRevalidationResponsesService: MystiflyFlightRevalidationResponsesService,
  ) {}

  async processFlightPrebooking(
    processFlightPrebookingDto: AbstractProcessFlightPrebookingDto,
  ) {
    console.log('processFlightPrebooking!!!!!');
    const {
      flightType,
      prebookingFlight,
      providerDetails,
      transactionFlightId,
      transactionId,
    } = processFlightPrebookingDto;
    const updateTransactionFlightRequestDto: UpdateTransactionFlightRequestDto =
      {
        id: transactionFlightId,
        prebookingFlight,
      };
    console.log('flightType: ', flightType);

    console.log(
      'updateTransactionFlightRequestDto: ',
      updateTransactionFlightRequestDto,
    );

    switch (flightType.toString()) {
      case FlightType.OneWay.toString(): {
        console.log('OneWay or Roundtrip');
        const { fareRules, revalidation } = providerDetails;

        fareRules.sequence = 1;
        fareRules.providerReference = prebookingFlight.providerReference;
        fareRules.transactionId = transactionId;

        revalidation.sequence = 1;
        revalidation.providerReference = prebookingFlight.providerReference;
        revalidation.transactionId = transactionId;

        const [
          mystiflyFlightFareRulesResponse,
          mystiflyFlightRevalidationResponse,
        ] = await Promise.all([
          this.mystiflyFlightFareRulesResponsesService.create(fareRules),
          this.mystiflyFlightRevalidationResponsesService.create(revalidation),
        ]);

        updateTransactionFlightRequestDto.prebookingFlight.mystiflyFlightFareRulesResponses =
          [mystiflyFlightFareRulesResponse];
        updateTransactionFlightRequestDto.prebookingFlight.mystiflyFlightRevalidationResponses =
          [mystiflyFlightRevalidationResponse];

        console.log(
          'updateTransactionFlightRequestDto: ',
          updateTransactionFlightRequestDto,
        );

        return updateTransactionFlightRequestDto;
      }

      case FlightType.Roundtrip.toString(): {
        console.log('OneWay or Roundtrip');
        const { fareRules, revalidation } = providerDetails;

        fareRules.sequence = 1;
        fareRules.providerReference = prebookingFlight.providerReference;
        fareRules.transactionId = transactionId;

        revalidation.sequence = 1;
        revalidation.providerReference = prebookingFlight.providerReference;
        revalidation.transactionId = transactionId;

        const [
          mystiflyFlightFareRulesResponse,
          mystiflyFlightRevalidationResponse,
        ] = await Promise.all([
          this.mystiflyFlightFareRulesResponsesService.create(fareRules),
          this.mystiflyFlightRevalidationResponsesService.create(revalidation),
        ]);

        updateTransactionFlightRequestDto.prebookingFlight.mystiflyFlightFareRulesResponses =
          [mystiflyFlightFareRulesResponse];
        updateTransactionFlightRequestDto.prebookingFlight.mystiflyFlightRevalidationResponses =
          [mystiflyFlightRevalidationResponse];

        console.log(
          'updateTransactionFlightRequestDto: ',
          updateTransactionFlightRequestDto,
        );

        return updateTransactionFlightRequestDto;
      }

      case FlightType.RoundtripOld.toString(): {
        console.log('RoundtripOld');
        const { departureDetails, returnDetails } = providerDetails;

        departureDetails.fareRules.sequence = 1;
        departureDetails.fareRules.providerReference =
          prebookingFlight.providerReference;
        departureDetails.fareRules.transactionId = transactionId;
        departureDetails.revalidation.sequence = 1;
        departureDetails.revalidation.providerReference =
          prebookingFlight.providerReference;
        departureDetails.revalidation.transactionId = transactionId;

        returnDetails.fareRules.sequence = 2;
        returnDetails.fareRules.providerReference =
          prebookingFlight.providerReference;
        returnDetails.fareRules.transactionId = transactionId;
        returnDetails.revalidation.sequence = 2;
        returnDetails.revalidation.providerReference =
          prebookingFlight.providerReference;
        returnDetails.revalidation.transactionId = transactionId;

        const [
          mystiflyFlightFareRulesResponseDeparture,
          mystiflyFlightRevalidationResponseDeparture,
          mystiflyFlightFareRulesResponseReturn,
          mystiflyFlightRevalidationResponseReturn,
        ] = await Promise.all([
          this.mystiflyFlightFareRulesResponsesService.create(
            departureDetails.fareRules,
          ),
          this.mystiflyFlightRevalidationResponsesService.create(
            departureDetails.revalidation,
          ),
          this.mystiflyFlightFareRulesResponsesService.create(
            returnDetails.fareRules,
          ),
          this.mystiflyFlightRevalidationResponsesService.create(
            returnDetails.revalidation,
          ),
        ]);

        updateTransactionFlightRequestDto.prebookingFlight.mystiflyFlightFareRulesResponses =
          [
            mystiflyFlightFareRulesResponseDeparture,
            mystiflyFlightFareRulesResponseReturn,
          ];
        updateTransactionFlightRequestDto.prebookingFlight.mystiflyFlightRevalidationResponses =
          [
            mystiflyFlightRevalidationResponseDeparture,
            mystiflyFlightRevalidationResponseReturn,
          ];

        return updateTransactionFlightRequestDto;
      }
    }
  }
}
