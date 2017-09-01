import { IEntity } from '../ientity';

export interface IProject extends IEntity {
  name?: string;
  description?: string;
  tags?: string[];
}
