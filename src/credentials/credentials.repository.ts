import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { GenericRepository } from '../common/abstracts/generic-repository.abstract';
import { PaginationQueryDto } from '../common/dtos/request/pagination-query.dto';
import { MyLoggerService } from '../utils/my-logger.service';
import { Credential } from './credential.entity';
import { Providers } from './providers.enum';

@Injectable()
export class CredentialsRepository implements GenericRepository<Credential> {
  constructor(
    @InjectRepository(Credential)
    private readonly repository: Repository<Credential>,
    private readonly loggerService: MyLoggerService,
  ) {}

  async create(entity: Credential) {
    this.loggerService.log('create...');
    return await this.repository.save(entity);
  }

  async fetchAll(): Promise<Credential[]>;
  async fetchAll(queryDto: PaginationQueryDto): Promise<Credential[]>;

  async fetchAll(queryDto?: PaginationQueryDto) {
    this.loggerService.log('fetchAll...');

    switch (arguments.length) {
      case 0:
        return await this.repository.find();
      case 1:
        if (arguments['0'] instanceof PaginationQueryDto) {
          const { page, limit, order } = queryDto;
          return await this.repository.find({
            order: { id: order },
            take: limit,
            skip: limit * (page - 1),
          });
        }
    }
  }

  async fetchById(id: number): Promise<Credential> {
    this.loggerService.log('fetchById...');
    return await this.repository.findOneBy({
      id,
    });
  }

  async update(entity: Credential) {
    this.loggerService.log('update...');
    return await this.repository.save(entity);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');
    const { affected } = await this.repository.delete(id);
    if (affected === 1) return true;
    return false;
  }

  async fetchByProvider(provider: Providers) {
    this.loggerService.log('fetchByProvider...');

    return await this.repository.findOneBy({
      provider,
    });
  }
}
