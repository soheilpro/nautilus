import * as errors from 'restify-errors';
import { RouterBase } from '../router-base';
import { ISession, ISessionManager, ISessionChange } from '../../framework/session';
import { IUserManager, UserFilter } from '../../framework/user';
import { IUserLogManager } from '../../framework/user-log';
import { IDateTimeService } from '../../services';
import { SessionModel } from '../../models';
import { IRequest, IResponse, Params } from '../../web';
import { IRoute } from '../iroute';

export class SessionRouter extends RouterBase<ISession, ISessionChange> {
  constructor(private sessionManager: ISessionManager, private userManager: IUserManager, userLogManager: IUserLogManager, dateTimeService: IDateTimeService) {
    super(sessionManager, userLogManager, dateTimeService);

    this.postEntity = this.postEntity.bind(this);
  }

  readonly name = 'sessions';

  getRoutes(): IRoute[] {
    return [
      this.route('post', '/sessions', this.postEntity),
    ];
  }

  protected async postEntity(request: IRequest, response: IResponse): Promise<void> {
    const bodyParams = new Params(request.body);
    const username = bodyParams.readString('username');
    const password = bodyParams.readString('password');

    if (!username)
      return response.send(new errors.UnprocessableEntityError('Missing username.'));

    if (!password)
      return response.send(new errors.UnprocessableEntityError('Missing password.'));

    const user = await this.userManager.get(new UserFilter(username));

    if (!user || !this.userManager.testPassword(password, user.passwordHash))
        return response.send(new errors.UnauthorizedError());

    const session: ISession = {
      user: user,
    };

    const validationError = this.sessionManager.validateEntity(session);

    if (validationError)
      return response.send(new errors.UnprocessableEntityError(validationError.message));

    const insertedEntity = await this.sessionManager.insert(session);
    const data = this.entityToModel(insertedEntity);

    response.send(201, {
      data: data,
    });
  }

  entityToModel(entity: ISession): SessionModel {
    if (!entity)
      return undefined;

    return new SessionModel(entity);
  }
}
