import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { PaginationQueryDto } from '../../common/dtos/request/pagination-query.dto';
import { TboHotels } from '../../providers/tbo/hotel-utils/hotels/dtos/response/tbo-hotel-codes-response.dto';
import { TboHotelsService } from '../../providers/tbo/hotel-utils/hotels/tbo-hotels.service';
import { TboHotelUtilsService } from '../../providers/tbo/hotel-utils/tbo-hotel-utils.service';
import { ErrorHandlerService } from '../../utils/error-handler.service';
import { MyLoggerService } from '../../utils/my-logger.service';
import { CreateScrappingsTboHotelRequestDto } from './dtos/request/create-scrappings-tbo-hotel-request.dto';
import { UpdateScrappingsTboHotelRequestDto } from './dtos/request/update-scrappings-tbo-hotel-request.dto';
import { ScrappingsTboHotel } from './scrappings-tbo-hotel.mongo-entity';
import { ScrappingsTboHotelsRepository } from './scrappings-tbo-hotels.repository';

@Injectable()
export class ScrappingsTboHotelsService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly scrappingsTboHotelsRepository: ScrappingsTboHotelsRepository,
    private readonly tboHotelUtilsService: TboHotelUtilsService,
    private readonly tboHotelsService: TboHotelsService,
  ) {}

  async create(requestDto: CreateScrappingsTboHotelRequestDto) {
    this.loggerService.log('create...');

    const entity = this.classMapper.map(
      requestDto,
      CreateScrappingsTboHotelRequestDto,
      ScrappingsTboHotel,
    );

    return await this.scrappingsTboHotelsRepository.create(entity);
  }

  async fetchAll(): Promise<ScrappingsTboHotel[]>;
  async fetchAll(queryDto: PaginationQueryDto): Promise<ScrappingsTboHotel[]>;

  async fetchAll(queryDto?: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    switch (arguments.length) {
      case 0:
        return await this.scrappingsTboHotelsRepository.fetchAll();
      case 1:
        if (arguments['0'] instanceof PaginationQueryDto)
          return await this.scrappingsTboHotelsRepository.fetchAll(queryDto);
    }
  }

  async fetchById(id: string) {
    this.loggerService.log('fetchById...');

    const entity = await this.scrappingsTboHotelsRepository.fetchById(id);
    if (!entity) this.errorHandlerService.notFoundException('Id not found');

    return entity;
  }

  async update(requestDto: UpdateScrappingsTboHotelRequestDto) {
    this.loggerService.log('update...');

    await this.fetchById(requestDto.id);

    const entity = this.classMapper.map(
      requestDto,
      UpdateScrappingsTboHotelRequestDto,
      ScrappingsTboHotel,
    );

    const result = await Promise.all([
      this.scrappingsTboHotelsRepository.update(entity),
    ]);

    return result;
  }

  async deleteById(id: string) {
    this.loggerService.log('deleteById...');

    await this.fetchById(id);

    const isSuccess = await this.scrappingsTboHotelsRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }

  async scrapeTboHotelsByCountryCode(countryCode: string) {
    this.loggerService.log('scrapeTboHotelsByCountryCode...');

    const tboCityCodes = (
      await this.tboHotelUtilsService.fetchCitiesOfCountry(countryCode)
    ).CityList.map((tboCityCode) => tboCityCode.Code);

    const tempTboHotels = (
      await Promise.all(
        tboCityCodes.map((tboCityCode) =>
          this.tboHotelsService.fetchHotelCodesByCityCode(tboCityCode),
        ),
      )
    ).map((tboHotel) => tboHotel.Hotels);

    const tboHotels: TboHotels[] = [];

    tempTboHotels.forEach((tempTboHotel) => {
      if (tempTboHotel && tempTboHotel.length !== 0)
        tboHotels.push(...tempTboHotel);
    });

    return await Promise.all(
      tboHotels.map((tboHotel) => this.create(tboHotel)),
    );
  }

  async scrapeTboHotels() {
    this.loggerService.log('scrapeTboHotels...');

    const tboCountryCodes = (
      await this.tboHotelUtilsService.fetchCountries()
    ).CountryList.map((tboCountryCode) => tboCountryCode.Code);

    const result = await Promise.all(
      tboCountryCodes.map((tboCountryCode) =>
        this.scrapeTboHotelsByCountryCode(tboCountryCode),
      ),
    );

    return result;
  }
}
