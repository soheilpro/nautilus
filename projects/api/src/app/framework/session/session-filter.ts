import { IFilter } from '../ifilter';
import { IUser } from '../user';

export class SessionFilter implements IFilter {
  constructor(public accessToken: string, public user: IUser) {
  }
}
