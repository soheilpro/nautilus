import { IService } from '../iservice';
import { IItem } from './iitem';
import { IItemChange } from './iitem-change';
import { IItemFilter } from './iitem-filter';
import { IItemGetResult } from './iitem-get-result';

export interface IItemService extends IService<IItem, IItemFilter, IItemChange, IItemGetResult> {
}
