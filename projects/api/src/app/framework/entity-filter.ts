import { IFilter } from './ifilter';

export class EntityFilter implements IFilter {
  constructor(public id: string) {
  }
}
