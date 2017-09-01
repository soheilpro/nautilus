import { IManager } from '../imanager';
import { IItemState } from './iitem-state';
import { IItemStateChange } from './iitem-state-change';

export interface IItemStateManager extends IManager<IItemState, IItemStateChange> {
}
