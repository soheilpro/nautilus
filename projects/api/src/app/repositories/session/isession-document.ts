import { IDocument, IManagedDocument } from '../../db';

export interface ISessionDocument extends IManagedDocument {
  accessToken?: string;
  user?: IDocument;
}
