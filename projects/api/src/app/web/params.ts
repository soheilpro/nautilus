import { IEntity, IManager, EntityFilter } from '../framework';
import { IParams } from './iparams';
import { InvalidEntityParamError } from './invalid-entity-param-error';

export class Params implements IParams {
  constructor(private source: IObject = {}) {
  }

  readString(name: string) {
    const value = this.source[name] as string;

    if (value === undefined)
      return undefined;

    return value;
  }

  readInt(name: string) {
    const value = this.source[name] as string;

    if (value === undefined)
      return undefined;

    // To handle all the edge cases of parsing an integer ('', '1.1', etc.),
    // both these methods should return the same result
    const num1 = Number(value);
    const num2 = parseInt(value, 10);

    if (num1 !== num2)
      return NaN;

    return num1;
  }

  readStringArray(name: string) {
    const value = this.source[name] as string;

    if (value === undefined)
      return undefined;

    const items = value.split(',').filter(item => !!item);

    if (items.length === 0)
      return null;

    return items;
  }

  async readEntity<TEntity extends IEntity>(name: string, manager: IManager<TEntity, any>, ignoreIfNotFound?: boolean) {
    const id = this.source[name] as string;

    if (id === undefined)
      return undefined;

    if (!id)
      return null;

    const filter = new EntityFilter(id);
    const entity = await manager.get(filter);

    if (!entity && !ignoreIfNotFound)
      throw new InvalidEntityParamError(name);

    return entity;
  }

  readId(name: string) {
    return this.source[name];
  }
}
