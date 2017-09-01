import { IDB } from '../db';

export interface ISchema {
  readonly version: number;
  apply(db: IDB, managedDB: IDB): Promise<void>;
}
