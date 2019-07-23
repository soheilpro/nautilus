import { IRepository } from '../irepository';
import { IItemPriority } from './iitem-priority';
import { IItemPriorityChange } from './iitem-priority-change';

export interface IItemPriorityRepository extends IRepository<IItemPriority, IItemPriorityChange> {
}
