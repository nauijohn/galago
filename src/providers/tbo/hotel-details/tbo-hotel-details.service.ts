import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { PaginationQueryDto } from '../../../common/dtos/request/pagination-query.dto';
import { RequestWithUser } from '../../../common/interfaces/request-with-user.interface';
import { ErrorHandlerService } from '../../../utils/error-handler.service';
import { MyLoggerService } from '../../../utils/my-logger.service';
import { CreateTboHotelDetailRequestDto } from './dtos/request/create-tbo-hotel-detail-request.dto';
import { UpdateTboHotelDetailRequestDto } from './dtos/request/update-tbo-hotel-detail.request.dto';
import { TboHotelDetail } from './tbo-hotel-detail.entity';
import { TboHotelDetailsRepository } from './tbo-hotel-details.repository';

@Injectable()
export class TboHotelDetailsService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly tboHotelDetailsRepository: TboHotelDetailsRepository,
  ) {}

  async create(requestDto: CreateTboHotelDetailRequestDto) {
    this.loggerService.log('create...');

    const entity = this.classMapper.map(
      requestDto,
      CreateTboHotelDetailRequestDto,
      TboHotelDetail,
    );
    entity.userId = this.request.user?.id ?? null;

    return await this.tboHotelDetailsRepository.create(entity);
  }

  async fetchAll(): Promise<TboHotelDetail[]>;
  async fetchAll(queryDto: PaginationQueryDto): Promise<TboHotelDetail[]>;

  async fetchAll(queryDto?: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    switch (arguments.length) {
      case 0:
        return await this.tboHotelDetailsRepository.fetchAll();
      case 1:
        if (arguments['0'] instanceof PaginationQueryDto)
          return await this.tboHotelDetailsRepository.fetchAll(queryDto);
    }
  }

  async fetchById(id: number) {
    this.loggerService.log('fetchById...');

    const entity = await this.tboHotelDetailsRepository.fetchById(id);
    if (!entity) this.errorHandlerService.notFoundException('Id not found');

    return entity;
  }

  async update(requestDto: UpdateTboHotelDetailRequestDto) {
    this.loggerService.log('update...');

    await this.fetchById(requestDto.id);

    const entity = this.classMapper.map(
      requestDto,
      UpdateTboHotelDetailRequestDto,
      TboHotelDetail,
    );

    return await this.tboHotelDetailsRepository.update(entity);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    await this.fetchById(id);

    const isSuccess = await this.tboHotelDetailsRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }
}
