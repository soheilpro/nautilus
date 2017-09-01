import { IChange } from './ichange';
import { IEntity } from './ientity';
import { IFilter } from './ifilter';
import { IGetResult } from './iget-result';

export interface IService<TEntity extends IEntity, TFilter extends IFilter, TChange extends IChange, TGetResult extends IGetResult<TEntity>> {
  get(filter?: TFilter, supplement?: string[]): Promise<TGetResult>;
  insert(entity: TEntity): Promise<TEntity>;
  update(id: string, change: TChange): Promise<TEntity>;
  delete(id: string): Promise<void>;
}
