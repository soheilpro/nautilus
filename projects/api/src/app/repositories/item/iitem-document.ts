import { IDocument, IManagedDocument } from '../../db';

export interface IItemDocument extends IManagedDocument {
  sid?: string;
  kind?: string;
  type?: IDocument;
  title?: string;
  description?: string;
  state?: IDocument;
  tags?: string[];
  project?: IDocument;
  assignedTo?: IDocument;
  createdBy?: IDocument;
  modifiedBy?: IDocument;
}
