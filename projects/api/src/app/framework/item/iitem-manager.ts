import { IManager } from '../imanager';
import { IItem } from './iitem';
import { IItemChange } from './iitem-change';

export interface IItemManager extends IManager<IItem, IItemChange> {
}
