import * as EventEmitter from 'events';
import { IDateTimeService } from './services';
import { IDBConnection, IDocument, DB, ManagedDB } from './db';
import { schemas } from './schema';

interface IMetaDocument extends IDocument {
  version: number;
}

class Updater extends EventEmitter {
  constructor(private dbConnection: IDBConnection, private dateTimeService: IDateTimeService) {
    super();
  }

  async run(): Promise<void> {
    const db = new DB(this.dbConnection);
    const managedDB = new ManagedDB(this.dbConnection, this.dateTimeService);

    const meta = (await db.select<IMetaDocument>('meta', {}))[0];
    const currentVersion = meta ? (meta.version || 0) : 0;

    for (const schema of schemas) {
      if (schema.version <= currentVersion)
        continue;

      this.emit('updating', schema.version);

      await schema.apply(db, managedDB);
      await db.update('meta', {}, { $set: { version: schema.version } }, true);

      this.emit('updated', schema.version);
    }

    this.emit('end');
  }
}

export class UpdaterFactory {
  createUpdater(dbConnection: IDBConnection, dateTimeService: IDateTimeService): Updater {
    return new Updater(dbConnection, dateTimeService);
  }
}
