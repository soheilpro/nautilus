import { IManager } from '../imanager';
import { IItemRelationship } from './iitem-relationship';
import { IItemRelationshipChange } from './iitem-relationship-change';

export interface IItemRelationshipManager extends IManager<IItemRelationship, IItemRelationshipChange> {
}
