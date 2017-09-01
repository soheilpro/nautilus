import { IQuery } from './iquery';

export class Query implements IQuery {
  set(key: string, value: any, map?: (value: any) => any) {
    if (value === undefined)
      return;

    (this as IObject)[key] = map ? map(value) : value;
  }
}
