import { IDateTimeService } from '../services';
import { IDBConnection } from './idb-connection';
import { IDocument } from './idocument';
import { IManagedDocument } from './imanaged-document';
import { ManagedDocumentState } from './managed-document-state';
import { IQuery } from './iquery';
import { IUpdate } from './iupdate';
import { DB } from './db';
import { Update } from './update';

export class ManagedDB extends DB {
  constructor(dbConnection: IDBConnection, private dateTimeService: IDateTimeService) {
    super(dbConnection);
  }

  async select<TDocument extends IManagedDocument>(collectionName: string, query: IQuery) {
    query = {
      ...query,
      'meta.state': { $ne: ManagedDocumentState.Deleted },
    };

    return (await super.select(collectionName, query)) as TDocument[];
  }

  async count(collectionName: string, query: IQuery) {
    query = {
      ...query,
      'meta.state': { $ne: ManagedDocumentState.Deleted },
    };

    return await super.count(collectionName, query);
  }

  async insert<TDocument extends IManagedDocument>(collectionName: string, document: IDocument) {
    const metaDocument = {
      ...document,
      meta: {
        version: await this.nextVersion(),
        state: ManagedDocumentState.Inserted,
        insertDateTime: this.dateTimeService.nowUTC(),
      },
    };

    return (await super.insert(collectionName, metaDocument)) as TDocument;
  }

  async update<TDocument extends IManagedDocument>(collectionName: string, query: IQuery, update: IUpdate) {
    query = {
      ...query,
      'meta.state': { $ne: ManagedDocumentState.Deleted },
    };

    update = new Update(update);
    update.setOrUnset('meta.version', await this.nextVersion());
    update.setOrUnset('meta.state', ManagedDocumentState.Updated);
    update.setOrUnset('meta.updateDateTime', this.dateTimeService.nowUTC());

    return (await super.update(collectionName, query, update)) as TDocument;
  }

  async delete(collectionName: string, query: IQuery) {
    query = {
      ...query,
      'meta.state': { $ne: ManagedDocumentState.Deleted },
    };

    const update = new Update();
    update.setOrUnset('meta.version', await this.nextVersion());
    update.setOrUnset('meta.state', ManagedDocumentState.Deleted);
    update.setOrUnset('meta.deleteDateTime', this.dateTimeService.nowUTC());

    await super.update(collectionName, query, update);
  }

  private async nextVersion() {
    return await super.counter('*.meta.version');
  }
}
