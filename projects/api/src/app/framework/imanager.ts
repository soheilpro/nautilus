import { IEntity } from './ientity';
import { IFilter } from './ifilter';
import { IChange } from './ichange';
import { IValidationError } from './ivalidation-error';

export interface IManager<TEntity extends IEntity, TChange extends IChange> {
  getAll(filter: IFilter): Promise<TEntity[]>;
  get(filter: IFilter): Promise<TEntity>;
  insert(entity: TEntity): Promise<TEntity>;
  update(id: string, change: TChange): Promise<TEntity>;
  delete(id: string): Promise<void>;
  validateEntity(entity: TEntity): IValidationError;
  validateChange(change: TChange): IValidationError;
  getEntityDuplicateCheckFilter(entity: TEntity): IFilter;
  getChangeDuplicateCheckFilter(change: TChange): IFilter;
}
