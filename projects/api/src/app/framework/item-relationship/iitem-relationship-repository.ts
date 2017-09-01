import { IRepository } from '../irepository';
import { IItemRelationship } from './iitem-relationship';
import { IItemRelationshipChange } from './iitem-relationship-change';

export interface IItemRelationshipRepository extends IRepository<IItemRelationship, IItemRelationshipChange> {
}
