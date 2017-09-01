import { IService } from '../iservice';
import { IItemRelationship } from './iitem-relationship';
import { IItemRelationshipChange } from './iitem-relationship-change';
import { IItemRelationshipFilter } from './iitem-relationship-filter';
import { IItemRelationshipGetResult } from './iitem-relationship-get-result';

export interface IItemRelationshipService extends IService<IItemRelationship, IItemRelationshipFilter, IItemRelationshipChange, IItemRelationshipGetResult> {
}
