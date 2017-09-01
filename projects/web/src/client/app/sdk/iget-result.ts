import { IEntity } from './ientity';

export interface IGetResult<TEntity extends IEntity> {
  entities: TEntity[];
}
