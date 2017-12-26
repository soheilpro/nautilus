import * as mongodb from 'mongodb';
import { IDBConnection } from './idb-connection';

export class DBConnection implements IDBConnection {
  private static _db: mongodb.Db;

  constructor(private address: string) {
  }

  isOpen(): boolean {
    return !!DBConnection._db;
  }

  async open(): Promise<void> {
    if (!this.isOpen())
      DBConnection._db = await mongodb.MongoClient.connect(this.address, { ignoreUndefined: true });
  }

  async getDB(): Promise<mongodb.Db> {
    await this.open();

    return DBConnection._db;
  }

  async close(): Promise<void> {
    if (this.isOpen())
      DBConnection._db.close();
  }
}
