import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { PaginationQueryDto } from '../../../common/dtos/request/pagination-query.dto';
import { RequestWithUser } from '../../../common/interfaces/request-with-user.interface';
import { ErrorHandlerService } from '../../../utils/error-handler.service';
import { MyLoggerService } from '../../../utils/my-logger.service';
import { CreateTboHotelPrebookResponseRequestDto } from './dtos/request/create-tbo-hotel-prebook-response-request.dto';
import { UpdateTboHotelPrebookResponseRequestDto } from './dtos/request/update-tbo-hotel-prebook-response-request.dto';
import { TboHotelPrebookResponse } from './tbo-hotel-prebook-response.entity';
import { TboHotelPrebookResponsesRepository } from './tbo-hotel-prebook-responses.repository';

@Injectable()
export class TboHotelPrebookResponsesService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly tboHotelPrebookResponsesRepository: TboHotelPrebookResponsesRepository,
  ) {}

  async create(requestDto: CreateTboHotelPrebookResponseRequestDto) {
    this.loggerService.log('create...');

    const entity = this.classMapper.map(
      requestDto,
      CreateTboHotelPrebookResponseRequestDto,
      TboHotelPrebookResponse,
    );
    entity.userId = this.request.user?.id ?? null;

    return await this.tboHotelPrebookResponsesRepository.create(entity);
  }

  async fetchAll(): Promise<TboHotelPrebookResponse[]>;
  async fetchAll(
    queryDto: PaginationQueryDto,
  ): Promise<TboHotelPrebookResponse[]>;

  async fetchAll(queryDto?: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    switch (arguments.length) {
      case 0:
        return await this.tboHotelPrebookResponsesRepository.fetchAll();
      case 1:
        if (arguments['0'] instanceof PaginationQueryDto)
          return await this.tboHotelPrebookResponsesRepository.fetchAll(
            queryDto,
          );
    }
  }

  async fetchById(id: number) {
    this.loggerService.log('fetchById...');

    const entity = await this.tboHotelPrebookResponsesRepository.fetchById(id);
    if (!entity) this.errorHandlerService.notFoundException('Id not found');

    return entity;
  }

  async update(requestDto: UpdateTboHotelPrebookResponseRequestDto) {
    this.loggerService.log('update...');

    await this.fetchById(requestDto.id);

    const entity = this.classMapper.map(
      requestDto,
      UpdateTboHotelPrebookResponseRequestDto,
      TboHotelPrebookResponse,
    );

    return await this.tboHotelPrebookResponsesRepository.update(entity);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    await this.fetchById(id);

    const isSuccess = await this.tboHotelPrebookResponsesRepository.deleteById(
      id,
    );
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }
}
