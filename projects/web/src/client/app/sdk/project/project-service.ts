import { ServiceBase } from '../service-base';
import { IProject } from './iproject';
import { IProjectChange } from './iproject-change';
import { IProjectFilter } from './iproject-filter';
import { IProjectGetResult } from './iproject-get-result';
import { IProjectService } from './iproject-service';

export class ProjectService extends ServiceBase<IProject, IProjectFilter, IProjectChange, IProjectGetResult> implements IProjectService {
  basePath(): string {
    return '/projects';
  }

  serializeFilter(filter: IProjectFilter): Object {
    return undefined;
  }

  serializeEntity(entity: IProject): Object {
    return {
      name: entity.name,
      description: entity.description,
      tags: entity.tags ? entity.tags.join(' ') : undefined,
    };
  }

  serializeChange(change: IProjectChange): Object {
    return {
      name: change.name,
      description: change.description,
      tags: change.tags ? change.tags.join(' ') : undefined,
    };
  }
}
