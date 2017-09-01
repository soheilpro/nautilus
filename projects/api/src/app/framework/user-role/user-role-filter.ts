import { IFilter } from '../ifilter';
import { IUser } from '../user';

export class UserRoleFilter implements IFilter {
  constructor(public user: IUser) {
  }
}
