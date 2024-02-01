import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { PaginationQueryDto } from '../../../common/dtos/request/pagination-query.dto';
import { RequestWithUser } from '../../../common/interfaces/request-with-user.interface';
import { ErrorHandlerService } from '../../../utils/error-handler.service';
import { MyLoggerService } from '../../../utils/my-logger.service';
import { CreateMystiflyFlightBookResponseRequestDto } from './dtos/request/create-mystifly-flight-book-response-request.dto';
import { UpdateMystiflyFlightBookResponseRequestDto } from './dtos/request/update-mystifly-flight-book-response-request.dto';
import { MystiflyFlightBookResponse } from './mystifly-flight-book-response.entity';
import { MystiflyFlightBookResponsesRepository } from './mystifly-flight-book-responses.repository';

@Injectable()
export class MystiflyFlightBookResponsesService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly mystiflyFlightBookResponsesRepository: MystiflyFlightBookResponsesRepository,
  ) {}

  async create(requestDto: CreateMystiflyFlightBookResponseRequestDto) {
    this.loggerService.log('create...');

    const entity = this.classMapper.map(
      requestDto,
      CreateMystiflyFlightBookResponseRequestDto,
      MystiflyFlightBookResponse,
    );

    return await this.mystiflyFlightBookResponsesRepository.create(entity);
  }

  async fetchAll(): Promise<MystiflyFlightBookResponse[]>;
  async fetchAll(
    queryDto: PaginationQueryDto,
  ): Promise<MystiflyFlightBookResponse[]>;

  async fetchAll(queryDto?: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    switch (arguments.length) {
      case 0:
        return await this.mystiflyFlightBookResponsesRepository.fetchAll();
      case 1:
        if (arguments['0'] instanceof PaginationQueryDto)
          return await this.mystiflyFlightBookResponsesRepository.fetchAll(
            queryDto,
          );
    }
  }

  async fetchById(id: number) {
    this.loggerService.log('fetchById...');

    const entity = await this.mystiflyFlightBookResponsesRepository.fetchById(
      id,
    );
    if (!entity) this.errorHandlerService.notFoundException('Id not found');

    return entity;
  }

  async update(requestDto: UpdateMystiflyFlightBookResponseRequestDto) {
    this.loggerService.log('update...');

    await this.fetchById(requestDto.id);

    const entity = this.classMapper.map(
      requestDto,
      UpdateMystiflyFlightBookResponseRequestDto,
      MystiflyFlightBookResponse,
    );

    return await this.mystiflyFlightBookResponsesRepository.update(entity);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    await this.fetchById(id);

    const isSuccess =
      await this.mystiflyFlightBookResponsesRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }
}
