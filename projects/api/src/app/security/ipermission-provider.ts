import { ISession } from '../framework/session';

export interface IPermissionProvider {
  getPermissions(session: ISession): Promise<string[]>;
}
