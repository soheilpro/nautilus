import { IEntity, IManager } from '../framework';

export interface IParams {
  readString(name: string): string;
  readStringArray(name: string): string[];
  readInt(name: string): number;
  readEntity<TEntity extends IEntity>(name: string, manager: IManager<TEntity, any>, ignoreIfNotFound?: boolean): Promise<TEntity>;
  readId(name: string): string;
}
