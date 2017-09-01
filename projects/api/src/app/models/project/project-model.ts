import { IProject } from '../../framework/project';
import { EntityModelBase } from '../entity-model-base';

export class ProjectModel extends EntityModelBase {
  tags: string[];
  description: string;
  name: string;

  constructor(entity: IProject) {
    super(entity);

    this.name = entity.name;
    this.description = entity.description || undefined;
    this.tags = entity.tags;
  }
}
