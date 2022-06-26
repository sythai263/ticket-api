import { FindManyOptions, FindOneOptions, FindOptionsWhere } from 'typeorm';

import { UniqueEntityID } from '../domain/UniqueEntityID';

export interface IRepo<T, X> {
  find(options?: FindManyOptions<T>): Promise<X[]>;
  findBy(where: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<X[]>;
  findById(id: number): Promise<X>;
  findOne(options: FindOneOptions<T>): Promise<X>;
  findOneBy(where: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<X>;
  save(t: T): Promise<X>;
  saveMany(t: T[]): Promise<X[]>;
  delete(
    criteria:
      | string
      | number
      | FindOptionsWhere<T>
      | Date
      | UniqueEntityID
      | string[]
      | number[]
      | Date[]
      | UniqueEntityID[],
  ): Promise<boolean>;
}
