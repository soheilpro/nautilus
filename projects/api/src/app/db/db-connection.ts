import * as mongodb from 'mongodb';
import { IDBConnection } from './idb-connection';

export class DBConnection implements IDBConnection {
  private static _db: mongodb.Db;

  constructor(private address: string) {
  }

  isOpen() {
    return !!DBConnection._db;
  }

  async open() {
    if (!this.isOpen())
      DBConnection._db = await mongodb.MongoClient.connect(this.address, { ignoreUndefined: true });
  }

  async getDB() {
    await this.open();

    return DBConnection._db;
  }

  async close() {
    if (this.isOpen())
      DBConnection._db.close();
  }
}
