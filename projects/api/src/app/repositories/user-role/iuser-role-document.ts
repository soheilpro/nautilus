import { IDocument, IManagedDocument } from '../../db';

export interface IUserRoleDocument extends IManagedDocument {
  user?: IDocument;
  project?: IDocument;
  name?: string;
}
