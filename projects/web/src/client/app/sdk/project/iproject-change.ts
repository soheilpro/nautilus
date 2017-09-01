import { IChange } from '../ichange';

export interface IProjectChange extends IChange {
  name?: string;
  description?: string;
  tags?: string[];
}
