import * as crypto from 'crypto';
import { Server } from 'restify';
import * as request from 'supertest';
import { IDBConnection, IDB, DBConnection, DB } from '../db';
import { DateTimeService } from '../services';
import { UpdaterFactory } from '../updater';
import { ServerFactory } from '../server';
import { UserModel, SessionModel } from '../models';

export class Context {
  dbConnection: IDBConnection;
  db: IDB;
  server: Server;
  adminUser: UserModel;
  adminSession: SessionModel;

  constructor() {
    this.init = this.init.bind(this);
    this.reset = this.reset.bind(this);
    this.destroy = this.destroy.bind(this);
  }

  private generateUniqeId(length: number): string {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
  }

  async init(): Promise<void> {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

    const dbName = `__nautilus_test_${this.generateUniqeId(12)}`;

    this.dbConnection = new DBConnection(`mongodb://localhost:27017/${dbName}`);
    this.db = new DB(this.dbConnection);

    const dateTimeService = new DateTimeService();

    const serverFactory = new ServerFactory();
    this.server = serverFactory.createServer(this.dbConnection, dateTimeService);

    return await this.reset();
  }

  async reset(): Promise<void> {
    await this.db.dropDatabase();

    const dateTimeService = new DateTimeService();

    const updaterFactory = new UpdaterFactory();
    const updater = updaterFactory.createUpdater(this.dbConnection, dateTimeService);
    await updater.run();

    this.adminSession = await this.createEntity(null, 'sessions', {
      'username': 'admin',
      'password': 'changeme',
    });

    this.adminUser = this.adminSession.user as UserModel;
  }

  async destroy(): Promise<void> {
    await this.db.dropDatabase();
    await this.dbConnection.close();
  }

  async createEntity(session: SessionModel, path: string, params: any): Promise<any> {
    let req = request(this.server)
      .post(`/${path}`)
      .send(params);

    if (session)
      req = req.auth(session.user.id, session.accessToken);

    const response = await req;

    if (response.status !== 201)
      throw new Error(`Failed to create entity at /${path}.`);

    return response.body.data;
  }
}
