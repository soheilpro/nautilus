import { IDB } from './idb';
import { IDBConnection } from './idb-connection';
import { IDocument } from './idocument';
import { IQuery } from './iquery';
import { IUpdate } from './iupdate';
import { ObjectHelper } from './object-helper';

interface ICounterDocument extends IDocument {
  name: string;
  value: number;
}

export class DB implements IDB {
  constructor(private dbConnection: IDBConnection) {
  }

  async select<TDocument extends IDocument>(collectionName: string, query: IQuery): Promise<TDocument[]> {
    const db = await this.dbConnection.getDB();
    const collection = db.collection<TDocument>(collectionName);

    return await collection.find<TDocument>(ObjectHelper.cleanUp(query)).toArray();
  }

  async count(collectionName: string, query: IQuery): Promise<number> {
    const db = await this.dbConnection.getDB();
    const collection = db.collection(collectionName);

    return await collection.count(ObjectHelper.cleanUp(query));
  }

  async insert<TDocument extends IDocument>(collectionName: string, document: IDocument): Promise<TDocument> {
    const db = await this.dbConnection.getDB();
    const collection = db.collection<TDocument>(collectionName);

    return (await collection.insertOne(ObjectHelper.cleanUp(document))).ops[0];
  }

  async update<TDocument extends IDocument>(collectionName: string, query: IQuery, update: IUpdate, upsert?: boolean): Promise<TDocument> {
    const db = await this.dbConnection.getDB();
    const collection = db.collection<TDocument>(collectionName);

    return (await collection.findOneAndUpdate(ObjectHelper.cleanUp(query), ObjectHelper.cleanUp(update), { returnOriginal: false, upsert: upsert })).value;
  }

  async delete(collectionName: string, query: IQuery): Promise<void> {
    const db = await this.dbConnection.getDB();
    const collection = db.collection(collectionName);

    await collection.deleteMany(ObjectHelper.cleanUp(query));
  }

  async drop(collectionName: string): Promise<void> {
    const db = await this.dbConnection.getDB();
    const collection = db.collection(collectionName);

    return collection.drop();
  }

  async counter(name: string): Promise<number> {
    const db = await this.dbConnection.getDB();
    const collection = db.collection<ICounterDocument>('counters');
    const query = { name: name };
    const update = { $inc: { value: 1 } };

    return (await collection.findOneAndUpdate(query, update, { returnOriginal: false, upsert: false })).value.value;
  }

  async dropDatabase(): Promise<void> {
    const db = await this.dbConnection.getDB();
    await db.dropDatabase();
  }
}
