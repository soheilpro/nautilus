import { IService } from '../iservice';
import { IItemType } from './iitem-type';
import { IItemTypeChange } from './iitem-type-change';
import { IItemTypeFilter } from './iitem-type-filter';
import { IItemTypeGetResult } from './iitem-type-get-result';

export interface IItemTypeService extends IService<IItemType, IItemTypeFilter, IItemTypeChange, IItemTypeGetResult> {
}
