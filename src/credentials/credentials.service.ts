import { Cache } from 'cache-manager';

import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { PaginationQueryDto } from '../common/dtos/request/pagination-query.dto';
import { MystiflyFlightUtilsService } from '../providers/mystifly/flight-utils/mystifly-flight-utils.service';
import { ErrorHandlerService } from '../utils/error-handler.service';
import { MyLoggerService } from '../utils/my-logger.service';
import { SecurityService } from '../utils/security.service';
import { Credential } from './credential.entity';
import { CredentialsRepository } from './credentials.repository';
import { CredentialsUtil } from './credentials.util';
import { CreateCredentialRequestDto } from './dtos/request/create-credential-request.dto';
import { UpdateCredentialRequestDto } from './dtos/request/update-credential-request.dto';
import { Providers } from './providers.enum';

@Injectable()
export class CredentialsService extends CredentialsUtil {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    private readonly credentialsRepository: CredentialsRepository,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @Inject(forwardRef(() => MystiflyFlightUtilsService))
    private readonly mystiflyFlightUtilsService: MystiflyFlightUtilsService,
    private readonly securityService: SecurityService,
  ) {
    super(securityService);
  }

  async create(requestDto: CreateCredentialRequestDto) {
    this.loggerService.log('create...');

    const entity = this.classMapper.map(
      requestDto,
      CreateCredentialRequestDto,
      Credential,
    );

    if (entity.provider.toLowerCase() === Providers.Mystifly) {
      const { accountNumber, username, password } = entity;
      const mystiflyCreateSessionResponse =
        await this.mystiflyFlightUtilsService.createSession({
          accountNumber,
          username,
          password,
        });
      if (mystiflyCreateSessionResponse.Success)
        entity.bearer = mystiflyCreateSessionResponse.Data.SessionId;
    }
    await this.encryptCredential(entity);
    return await this.credentialsRepository.create(entity);
  }

  async fetchAll(): Promise<Credential[]>;
  async fetchAll(queryDto: PaginationQueryDto): Promise<Credential[]>;

  async fetchAll(queryDto?: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');
    switch (arguments.length) {
      case 0:
        const credentials = await this.credentialsRepository.fetchAll();
        await this.decryptCredentials(credentials);
        return credentials;
      case 1:
        if (arguments['0'] instanceof PaginationQueryDto) {
          const credentials = await this.credentialsRepository.fetchAll(
            queryDto,
          );
          await this.decryptCredentials(credentials);
          return credentials;
        }
    }
  }

  async fetchById(id: number) {
    this.loggerService.log('fetchById...');

    const entity = await this.credentialsRepository.fetchById(id);
    if (!entity) this.errorHandlerService.notFoundException('Id not found');

    await this.decryptCredential(entity);
    return entity;
  }

  async update(requestDto: UpdateCredentialRequestDto) {
    this.loggerService.log('update...');

    await this.fetchById(requestDto.id);

    const entity = this.classMapper.map(
      requestDto,
      UpdateCredentialRequestDto,
      Credential,
    );

    if (entity.provider.toLowerCase() === Providers.Mystifly) {
      const { accountNumber, username, password } = entity;
      const mystiflyCreateSessionResponse =
        await this.mystiflyFlightUtilsService.createSession({
          accountNumber,
          username,
          password,
        });
      if (mystiflyCreateSessionResponse.Success)
        entity.bearer = mystiflyCreateSessionResponse.Data.SessionId;
    }

    await this.encryptCredential(entity);
    return await this.credentialsRepository.update(entity);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    await this.fetchById(id);

    const isSuccess = await this.credentialsRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }

  async fetchByProvider(provider: Providers) {
    this.loggerService.log('fetchByProvider...');

    const entityCached = await this.cacheManager.get<Credential>(
      'mystiflyCredential',
    );
    if (entityCached) {
      this.loggerService.log('get cache...');
      return entityCached;
    }

    const entity = await this.credentialsRepository.fetchByProvider(provider);
    await this.decryptCredential(entity);
    await this.cacheManager.set('mystiflyCredential', entity);
    return entity;
  }
}
