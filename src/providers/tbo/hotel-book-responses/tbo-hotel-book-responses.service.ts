import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { PaginationQueryDto } from '../../../common/dtos/request/pagination-query.dto';
import { RequestWithUser } from '../../../common/interfaces/request-with-user.interface';
import { ErrorHandlerService } from '../../../utils/error-handler.service';
import { MyLoggerService } from '../../../utils/my-logger.service';
import { CreateTboHotelBookResponseRequestDto } from './dtos/request/create-tbo-hotel-book-response-request.dto';
import { UpdateTboHotelBookResponseRequestDto } from './dtos/request/update-tbo-hotel-book-response-request.dto';
import { TboHotelBookResponse } from './tbo-hotel-book-response.entity';
import { TboHotelBookResponsesRepository } from './tbo-hotel-book-responses.repository';

@Injectable()
export class TboHotelBookResponsesService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly tboHotelBookResponsesRepository: TboHotelBookResponsesRepository,
  ) {}

  async create(requestDto: CreateTboHotelBookResponseRequestDto) {
    this.loggerService.log('create...');

    const entity = this.classMapper.map(
      requestDto,
      CreateTboHotelBookResponseRequestDto,
      TboHotelBookResponse,
    );
    entity.userId = entity.userId ?? this.request.user?.id ?? null;

    return await this.tboHotelBookResponsesRepository.create(entity);
  }

  async fetchAll(): Promise<TboHotelBookResponse[]>;
  async fetchAll(queryDto: PaginationQueryDto): Promise<TboHotelBookResponse[]>;

  async fetchAll(queryDto?: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    switch (arguments.length) {
      case 0:
        return await this.tboHotelBookResponsesRepository.fetchAll();
      case 1:
        if (arguments['0'] instanceof PaginationQueryDto)
          return await this.tboHotelBookResponsesRepository.fetchAll(queryDto);
    }
  }

  async fetchById(id: number) {
    this.loggerService.log('fetchById...');

    const entity = await this.tboHotelBookResponsesRepository.fetchById(id);
    if (!entity) this.errorHandlerService.notFoundException('Id not found');

    return entity;
  }

  async update(requestDto: UpdateTboHotelBookResponseRequestDto) {
    this.loggerService.log('update...');

    await this.fetchById(requestDto.id);

    const entity = this.classMapper.map(
      requestDto,
      UpdateTboHotelBookResponseRequestDto,
      TboHotelBookResponse,
    );

    return await this.tboHotelBookResponsesRepository.update(entity);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    await this.fetchById(id);

    const isSuccess = await this.tboHotelBookResponsesRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }
}
