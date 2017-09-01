import { IManagedDocument } from '../../db';

export interface IProjectDocument extends IManagedDocument {
  name?: string;
  description?: string;
  tags?: string[];
}
