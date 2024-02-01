import { IGenericRepository } from '../interfaces/generic-repository.interface';

export abstract class GenericRepository<T> implements IGenericRepository<T> {
  abstract create(item: T): Promise<T>;
  abstract fetchAll(): Promise<T[]>;
  abstract fetchById(id: number): Promise<T>;
  abstract update(item: T): Promise<T>;
  abstract deleteById(id: number): Promise<boolean>;
}

export abstract class GenericRepositoryMongo<T> {
  abstract create(item: T): Promise<T>;
  abstract fetchAll(): Promise<T[]>;
  abstract fetchById(id: string): Promise<T>;
  abstract update(item: T): Promise<T>;
  abstract deleteById(id: string): Promise<boolean>;
}
