import { ISession } from './isession';
import { IEntity } from '../ientity';
import { Entity } from '../entity';

export class Session extends Entity implements ISession {
  accessToken: string;
  user: IEntity;

  constructor(data: any) {
    super(data);

    this.accessToken = data.accessToken;
    this.user = new Entity(data.user);
  }
}
