import { RouterBase } from '../router-base';
import { IProject, IProjectManager, IProjectChange } from '../../framework/project';
import { IUserLogManager } from '../../framework/user-log';
import { IDateTimeService } from '../../services';
import { ProjectModel } from '../../models';
import { IRequest, IParams } from '../../web';

export class ProjectRouter extends RouterBase<IProject, IProjectChange> {
  constructor(projectManager: IProjectManager, userLogManager: IUserLogManager, dateTimeService: IDateTimeService) {
    super(projectManager, userLogManager, dateTimeService);
  }

  readonly name = 'projects';

  getRoutes() {
    return [
      this.protectedRoute('get',   '/projects',     this.getEntities),
      this.protectedRoute('get',   '/projects/:id', this.getEntity),
      this.protectedRoute('post',  '/projects',     this.postEntity),
      this.protectedRoute('patch', '/projects/:id', this.patchEntity),
      this.protectedRoute('del',   '/projects/:id', this.deleteEntity),
    ];
  }

  async entityFromParams(params: IParams, request: IRequest) {
    return {
      ...await super.entityFromParams(params, request),
      name: params.readString('name'),
      description: params.readString('description'),
      tags: params.readStringArray('tags'),
    };
  }

  async changeFromParams(params: IParams, request: IRequest) {
    return {
      ...await super.changeFromParams(params, request),
      name: params.readString('name'),
      description: params.readString('description'),
      tags: params.readStringArray('tags'),
    };
  }

  entityToModel(entity: IProject) {
    return new ProjectModel(entity);
  }
}
