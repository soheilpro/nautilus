import { IRepository } from '../irepository';
import { IItem } from './iitem';
import { IItemChange } from './iitem-change';

export interface IItemRepository extends IRepository<IItem, IItemChange> {
}
