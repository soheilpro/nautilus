import { EntityState } from './entity-state';

export interface IEntity {
  id?: string;
  meta?: {
    version?: number,
    state?: EntityState,
    insertDateTime?: Date,
    updateDateTime?: Date,
    deleteDateTime?: Date,
  };
}
