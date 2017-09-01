import { IManager } from '../imanager';
import { IItemType } from './iitem-type';
import { IItemTypeChange } from './iitem-type-change';

export interface IItemTypeManager extends IManager<IItemType, IItemTypeChange> {
}
