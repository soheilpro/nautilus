import { IRepository } from '../irepository';
import { IItemState } from './iitem-state';
import { IItemStateChange } from './iitem-state-change';

export interface IItemStateRepository extends IRepository<IItemState, IItemStateChange> {
}
