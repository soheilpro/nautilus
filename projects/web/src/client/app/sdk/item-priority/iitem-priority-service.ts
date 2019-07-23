import { IService } from '../iservice';
import { IItemPriority } from './iitem-priority';
import { IItemPriorityChange } from './iitem-priority-change';
import { IItemPriorityFilter } from './iitem-priority-filter';
import { IItemPriorityGetResult } from './iitem-priority-get-result';

export interface IItemPriorityService extends IService<IItemPriority, IItemPriorityFilter, IItemPriorityChange, IItemPriorityGetResult> {
}
