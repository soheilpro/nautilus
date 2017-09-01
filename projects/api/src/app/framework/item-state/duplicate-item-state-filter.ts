import { IFilter } from '../ifilter';

export class DuplicateItemStateFilter implements IFilter {
  constructor(public key: string) {
  }
}
