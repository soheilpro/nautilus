import { ISession } from '../../framework/session';
import { EntityModelBase } from '../entity-model-base';
import { IEntityModel } from '../ientity-model';

export class SessionModel extends EntityModelBase {
  accessToken?: string;
  user?: IEntityModel;

  constructor(entity: ISession) {
    super(entity);

    this.accessToken = entity.accessToken;
    this.user = this.renderEntity(entity.user);
  }
}
