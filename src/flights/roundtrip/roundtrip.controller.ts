import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { Public } from '../../auth/decorators/is-public.decorator';
import { MyLoggerService } from '../../utils/my-logger.service';
import { RoundtripBookFlightsRequestDto } from './dtos/request/roundtrip-book-flights-request.dto';
import {
  RoundtripPreBookFlightsRequestDto,
  RoundtripPreBookFlightsRequestDto2,
} from './dtos/request/roundtrip-pre-book-flights-request.dto';
import { RoundtripSearchFlightsRequestDto } from './dtos/request/roundtrip-search-flights-request.dto';
import { RoundtripSearchFlightsResponseDto } from './dtos/response/roundtrip-search-flights-response.dto';
import { RoundtripService } from './roundtrip.service';

@Controller()
@ApiTags('flights')
@ApiBearerAuth('JWT-auth')
export class RoundtripController {
  constructor(
    private readonly rountripService: RoundtripService,
    private readonly loggerService: MyLoggerService,
  ) {}

  @Post('search')
  @HttpCode(HttpStatus.OK)
  @Public()
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'search flights results',
    type: RoundtripSearchFlightsResponseDto,
  })
  async search(
    @Body() roundtripSearchFlightsRequestDto: RoundtripSearchFlightsRequestDto,
  ): Promise<RoundtripSearchFlightsResponseDto> {
    this.loggerService.log('search...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.rountripService.search(roundtripSearchFlightsRequestDto),
    };
  }

  @Post('search2')
  @HttpCode(HttpStatus.OK)
  @Public()
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'search flights results',
    type: RoundtripSearchFlightsResponseDto,
  })
  async search2(
    @Query('isWithTotalMarkUp') isWithTotalMarkUp: boolean,
    @Body() requestDto: RoundtripSearchFlightsRequestDto,
  ): Promise<RoundtripSearchFlightsResponseDto> {
    this.loggerService.log('search2...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.rountripService.search2(requestDto, isWithTotalMarkUp),
    };
  }

  @Post('pre-book')
  @HttpCode(HttpStatus.OK)
  @Public()
  // @ApiOkResponse({
  //   status: HttpStatus.OK,
  //   description: 'pre-book flights results',
  //   type: OneWayPreBookFlightsResponseDto,
  // })
  async preBook(
    @Body()
    requestDto: RoundtripPreBookFlightsRequestDto,
  ) {
    this.loggerService.log('preBook...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.rountripService.preBook(requestDto),
    };
  }

  @Post('pre-book2')
  @HttpCode(HttpStatus.OK)
  @Public()
  // @ApiOkResponse({
  //   status: HttpStatus.OK,
  //   description: 'pre-book flights results',
  //   type: OneWayPreBookFlightsResponseDto,
  // })
  async preBook2(
    @Body()
    requestDto: RoundtripPreBookFlightsRequestDto2,
  ) {
    this.loggerService.log('preBook...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.rountripService.preBook2(requestDto),
    };
  }

  @Post('book')
  @HttpCode(HttpStatus.OK)
  @Public()
  // @ApiOkResponse({
  //   status: HttpStatus.OK,
  //   description: 'pre-book flights results',
  //   type: OneWayBookFlightsResponseDto,
  // })
  async book(@Body() requestDto: RoundtripBookFlightsRequestDto) {
    this.loggerService.log('book...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.rountripService.book(requestDto),
    };
  }
}
