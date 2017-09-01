import { IFilter } from '../ifilter';

export class DuplicateItemTypeFilter implements IFilter {
  constructor(public key: string) {
  }
}
