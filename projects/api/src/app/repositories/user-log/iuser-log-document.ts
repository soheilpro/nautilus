import { IDocument, IManagedDocument } from '../../db';

export interface IUserLogDocument extends IManagedDocument {
  dateTime?: Date;
  user?: IDocument;
  action?: string;
  item?: IDocument;
  params?: any;
}
