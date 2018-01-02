import { IDocument, IManagedDocument } from '../../db';

export interface IUserRoleDocument extends IManagedDocument {
  user?: IDocument;
  role?: string;
  project?: IDocument;
}
