import { ISchema } from './ischema';
import { IDB, IDocument } from '../db';

// tslint:disable-next-line:class-name
export class v1 implements ISchema {
  readonly version = 1;

  async apply(db: IDB, managedDB: IDB): Promise<void> {
    await db.insert('counters', {
      'name': '*.meta.version',
      'value': 0,
    });

    await db.insert('counters', {
      'name': 'items.sid',
      'value': 1000,
    });

    const adminUser: IDocument = await managedDB.insert('users', {
      'name': 'Admin',
      'username': 'admin',
      'passwordHash': '$2a$10$R0BhNd84UfgQjYbDzgOE7.R6vcIZXOC1UnWeIqkulax923VmNlNvi',
    });

    await managedDB.insert('userRoles', {
      'user': {
        '_id': adminUser._id,
      },
      'name': 'system.admin',
    });
  }
}
