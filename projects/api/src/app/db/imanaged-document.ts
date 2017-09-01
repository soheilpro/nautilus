import { IDocument } from './idocument';

export interface IManagedDocument extends IDocument {
  meta?: {
    version?: number,
    state?: number,
    insertDateTime?: Date,
    updateDateTime?: Date,
    deleteDateTime?: Date,
  };
}
