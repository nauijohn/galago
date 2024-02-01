import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { PaginationQueryDto } from '../../common/dtos/request/pagination-query.dto';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { TransactionHotelsService } from '../../transactions/hotels/transaction-hotels.service';
import { ErrorHandlerService } from '../../utils/error-handler.service';
import { MyLoggerService } from '../../utils/my-logger.service';
import { PrebookingHotelProcessesService } from '../prebooking-hotel-processes/prebooking-hotel-processes.service';
import { CreatePrebookingHotelRequestDto } from './dtos/request/create-prebooking-hotel-request.dto';
import { UpdatePrebookingHotelRequestDto } from './dtos/request/update-prebooking-hotel-request.dto';
import { PrebookingHotel } from './prebooking-hotel.entity';
import { PrebookingHotelsRepository } from './prebooking-hotels.repository';

@Injectable()
export class PrebookingHotelsService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly transactionHotelsService: TransactionHotelsService,
    private readonly prebookingHotelsRepository: PrebookingHotelsRepository,
    private readonly prebookingHotelProcessesService: PrebookingHotelProcessesService,
  ) {}

  async create(requestDto: CreatePrebookingHotelRequestDto) {
    this.loggerService.log('create...');

    const transactionHotel =
      await this.transactionHotelsService.fetchByTransactionId(
        requestDto.transactionId,
      );
    if (transactionHotel.prebookingHotel)
      this.errorHandlerService.internalServerErrorException(
        'TransactionHotel already pre-booked!',
      );

    const entity = this.classMapper.map(
      requestDto,
      CreatePrebookingHotelRequestDto,
      PrebookingHotel,
    );
    entity.userId = this.request.user?.id ?? null;

    const entityNew = await this.prebookingHotelsRepository.create(entity);

    const updateTransactionHotelRequestDto =
      await this.prebookingHotelProcessesService.processHotelPrebooking(
        requestDto.provider,
        {
          providerDetails: requestDto.providerDetails,
          transactionHotelId: transactionHotel.id,
          prebookingHotel: entityNew,
        },
      );

    await this.transactionHotelsService.update(
      updateTransactionHotelRequestDto,
    );

    return entityNew;
  }

  async fetchAll(): Promise<PrebookingHotel[]>;
  async fetchAll(queryDto: PaginationQueryDto): Promise<PrebookingHotel[]>;

  async fetchAll(queryDto?: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    switch (arguments.length) {
      case 0:
        return await this.prebookingHotelsRepository.fetchAll();
      case 1:
        if (arguments['0'] instanceof PaginationQueryDto)
          return await this.prebookingHotelsRepository.fetchAll(queryDto);
    }
  }

  async fetchById(id: number) {
    this.loggerService.log('fetchById...');

    const entity = await this.prebookingHotelsRepository.fetchById(id);
    if (!entity) this.errorHandlerService.notFoundException('Id not found');

    return entity;
  }

  async update(requestDto: UpdatePrebookingHotelRequestDto) {
    this.loggerService.log('update...');

    await this.fetchById(requestDto.id);

    const entity = this.classMapper.map(
      requestDto,
      UpdatePrebookingHotelRequestDto,
      PrebookingHotel,
    );

    return await this.prebookingHotelsRepository.update(entity);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    await this.fetchById(id);

    const isSuccess = await this.prebookingHotelsRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }
}
