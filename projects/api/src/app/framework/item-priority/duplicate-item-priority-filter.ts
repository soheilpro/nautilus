import { IFilter } from '../ifilter';

export class DuplicateItemPriorityFilter implements IFilter {
  constructor(public key: string) {
  }
}
