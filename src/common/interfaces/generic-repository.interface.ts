export interface IGenericRepository<T> {
  create(item: T): Promise<T>;
  fetchAll(): Promise<T[]>;
  fetchById(id: number): Promise<T>;
  update(item: T): Promise<T>;
  deleteById(id: number): Promise<boolean>;
}
