import { IFilter } from '../ifilter';

export class DuplicateProjectFilter implements IFilter {
  constructor(public name: string) {
  }
}
