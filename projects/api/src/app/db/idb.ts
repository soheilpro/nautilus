import { IDocument } from './idocument';
import { IQuery } from './iquery';
import { IUpdate } from './iupdate';

export interface IDB {
  select<TDocument extends IDocument>(collectionName: string, query: IQuery): Promise<TDocument[]>;
  count(collectionName: string, query: IQuery): Promise<number>;
  insert<TDocument extends IDocument>(collectionName: string, document: IDocument): Promise<TDocument>;
  update<TDocument extends IDocument>(collectionName: string, query: IQuery, update: IUpdate, upsert?: boolean): Promise<TDocument>;
  delete(collectionName: string, query: IQuery): Promise<void>;
  drop(collectionName: string): Promise<void>;
  counter(name: string): Promise<number>;
  dropDatabase(): Promise<void>;
}
