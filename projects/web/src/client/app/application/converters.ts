import { IEntity } from '../sdk';

export function asEntity(entity: IEntity): IEntity {
  if (!entity)
    return undefined;

  return {
    id: entity.id,
  };
}
