import { IEntity } from '../sdk';

export function entityComparer(entity1: IEntity, entity2: IEntity): boolean {
  if (!entity1 || !entity2)
    return false;

  return entity1.id === entity2.id;
}
