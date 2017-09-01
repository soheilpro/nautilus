import { IRepository } from '../irepository';
import { IItemType } from './iitem-type';
import { IItemTypeChange } from './iitem-type-change';

export interface IItemTypeRepository extends IRepository<IItemType, IItemTypeChange> {
}
