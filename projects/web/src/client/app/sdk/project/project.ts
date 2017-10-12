import { IProject } from './iproject';
import { Entity } from '../entity';

export class Project extends Entity implements IProject {
  name?: string;
  description?: string;
  tags?: string[];

  constructor(data: any) {
    super(data);

    this.name = data.name;
    this.description = data.description;
    this.tags = data.tags;
  }
}
