import * as restify from 'restify';
import { ISessionManager, SessionFilter } from '../framework/session';
import { IRequest, IResponse } from '../web';
import { IPermissionProvider } from '../security';

export function authenticator(sessionManager: ISessionManager, permissionProvider: IPermissionProvider) {
  return async (request: IRequest, response: IResponse, next: restify.Next) => {
    request.permissions = [];

    if (request.authorization.basic) {
      const userId = request.authorization.basic.username;
      const accessToken = request.authorization.basic.password;

      const sessionFilter = new SessionFilter(accessToken, { id: userId });
      const session = await sessionManager.get(sessionFilter);

      if (session) {
        const permissions = await permissionProvider.getPermissions(session.user);

        request.user = session.user;
        request.permissions = permissions;
      }
    }

    next();
  };
}
