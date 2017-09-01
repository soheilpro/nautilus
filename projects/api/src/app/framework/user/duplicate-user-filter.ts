import { IFilter } from '../ifilter';

export class DuplicateUserFilter implements IFilter {
  constructor(public username: string, public email: string) {
  }
}
