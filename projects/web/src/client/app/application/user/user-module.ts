import * as NQL from '../../nql';
import { IClient, IUser, IUserChange } from '../../sdk';
import { IApplication } from '../iapplication';
import ArrayHelper from '../../utilities/array-helper';
import { BaseModule } from '../base-module';
import { IUserModule } from './iuser-module';
import UserExpressionNormalizer from './user-expression-normalizer';

export class UserModule extends BaseModule implements IUserModule {
  private users: IUser[];
  private usersMap: { [id: string]: IUser };

  constructor(application: IApplication, private client: IClient) {
    super();
  }

  async load(): Promise<void> {
    const result = await this.client.users.get(null);

    this.users = result.entities;
    this.usersMap = ArrayHelper.toMap(this.users, user => user.id);
  }

  getAll(filterExpression: NQL.IExpression, sortExpressions: NQL.ISortExpression[]): IUser[] {
    let users = [...this.users];

    const expressionNormalizer = new UserExpressionNormalizer();

    if (filterExpression)
      users = this.filter(users, filterExpression, expressionNormalizer);

    if (sortExpressions)
      users = this.sort(users, sortExpressions, expressionNormalizer);

    return users;
  }

  get(user: IUser): IUser {
    if (!user)
      return null;

    return this.usersMap[user.id];
  }

  async add(user: IUser): Promise<IUser> {
    const newUser: IUser = {
      username: user.username,
      password: user.password,
      name: user.name,
      email: user.email,
    };

    const addedUser = await this.client.users.insert(newUser);

    this.users.push(addedUser);
    this.usersMap[addedUser.id] = addedUser;

    this.emit('user.add', { user: addedUser });

    return addedUser;
  }

  async update(user: IUser, userChange: IUserChange): Promise<IUser> {
    const change: IUserChange = {
      username: userChange.username,
      password: userChange.password,
      name: userChange.name,
      email: userChange.email,
    };

    const updatedUser = await this.client.users.update(user.id, change);

    this.users[this.users.indexOf(user)] = updatedUser;
    this.usersMap[updatedUser.id] = updatedUser;

    this.emit('user.update', { user: updatedUser });

    return updatedUser;
  }

  async delete(user: IUser): Promise<void> {
    await this.client.users.delete(user.id);

    this.users.splice(this.users.indexOf(user), 1);
    delete this.usersMap[user.id];

    this.emit('user.delete', { user: user });
  }
}
