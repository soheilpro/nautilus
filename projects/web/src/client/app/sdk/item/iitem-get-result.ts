import { IGetResult } from '../iget-result';
import { IItem } from './iitem';
import { IItemRelationship } from '../item-relationship';

export interface IItemGetResult extends IGetResult<IItem> {
  relationships: IItemRelationship[];
}
