import { IManager } from '../imanager';
import { IItemPriority } from './iitem-priority';
import { IItemPriorityChange } from './iitem-priority-change';

export interface IItemPriorityManager extends IManager<IItemPriority, IItemPriorityChange> {
}
