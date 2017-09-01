import { IDocument, IManagedDocument } from '../../db';

export interface IItemRelationshipDocument extends IManagedDocument {
  item1?: IDocument;
  item2?: IDocument;
  type?: string;
}
