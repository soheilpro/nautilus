import { IFilter } from '../ifilter';

export class UserFilter implements IFilter {
  constructor(public username: string) {
  }
}
