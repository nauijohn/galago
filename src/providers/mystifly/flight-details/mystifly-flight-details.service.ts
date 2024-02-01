import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { PaginationQueryDto } from '../../../common/dtos/request/pagination-query.dto';
import { RequestWithUser } from '../../../common/interfaces/request-with-user.interface';
import { ErrorHandlerService } from '../../../utils/error-handler.service';
import { MyLoggerService } from '../../../utils/my-logger.service';
import { SecurityService } from '../../../utils/security.service';
import { CreateMystiflyFlightDetailRequestDto } from './dtos/request/create-mystifly-flight-detail-request.dto';
import { UpdateMystiflyFlightDetailRequestDto } from './dtos/request/update-mystifly-flight-detail-request.dto';
import { MystiflyFlightDetail } from './mystifly-flight-detail.entity';
import { MystiflyFlightDetailsRepository } from './mystifly-flight-details.repository';

@Injectable()
export class MystiflyFlightDetailsService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly securityService: SecurityService,
    private readonly mystiflyFlightDetailsRepository: MystiflyFlightDetailsRepository,
  ) {}

  async create(requestDto: CreateMystiflyFlightDetailRequestDto) {
    this.loggerService.log('create...');

    const entity = this.classMapper.map(
      requestDto,
      CreateMystiflyFlightDetailRequestDto,
      MystiflyFlightDetail,
    );
    entity.userId = this.request.user?.id ?? null;

    return await this.mystiflyFlightDetailsRepository.create(entity);
  }

  async fetchAll(): Promise<MystiflyFlightDetail[]>;
  async fetchAll(queryDto: PaginationQueryDto): Promise<MystiflyFlightDetail[]>;

  async fetchAll(queryDto?: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    switch (arguments.length) {
      case 0:
        return await this.mystiflyFlightDetailsRepository.fetchAll();
      case 1:
        if (arguments['0'] instanceof PaginationQueryDto)
          return await this.mystiflyFlightDetailsRepository.fetchAll(queryDto);
    }
  }

  async fetchById(id: number) {
    this.loggerService.log('findById...');

    const entity = await this.mystiflyFlightDetailsRepository.fetchById(id);
    if (!entity) this.errorHandlerService.notFoundException('Id not found');

    return entity;
  }

  async update(requestDto: UpdateMystiflyFlightDetailRequestDto) {
    this.loggerService.log('update...');

    await this.fetchById(requestDto.id);

    const entity = this.classMapper.map(
      requestDto,
      UpdateMystiflyFlightDetailRequestDto,
      MystiflyFlightDetail,
    );

    return await this.mystiflyFlightDetailsRepository.update(entity);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    await this.fetchById(id);

    const isSuccess = await this.mystiflyFlightDetailsRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }

  async fetchByProviderReference(providerReference: string) {
    this.loggerService.log('findById...');
    return await this.mystiflyFlightDetailsRepository.fetchByProviderReference(
      providerReference,
    );
  }

  async fetchByPaymentReference(paymentReference: string) {
    this.loggerService.log('fetchByPaymentReference...');

    const decryptedPaymentReference =
      await this.securityService.decryptWordForURL(paymentReference);

    return await this.mystiflyFlightDetailsRepository.fetchByPaymentReference(
      decryptedPaymentReference,
    );
  }
}
