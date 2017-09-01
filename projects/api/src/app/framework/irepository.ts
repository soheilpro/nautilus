import { IEntity } from './ientity';
import { IFilter } from './ifilter';
import { IChange } from './ichange';

export interface IRepository<TEntity extends IEntity, TChange extends IChange> {
  getAll(filter: IFilter): Promise<TEntity[]>;
  get(filter: IFilter): Promise<TEntity>;
  insert(entity: TEntity): Promise<TEntity>;
  update(id: string, change: TChange): Promise<TEntity>;
  delete(id: string): Promise<void>;
  counter(name: string): Promise<number>;
}
