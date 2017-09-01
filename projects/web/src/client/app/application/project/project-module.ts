import * as _ from 'underscore';
import { IClient, IProject } from '../../sdk';
import { IApplication } from '../iapplication';
import ArrayHelper from '../../utilities/array-helper';
import { BaseModule } from '../base-module';
import { IProjectModule } from './iproject-module';

export class ProjectModule extends BaseModule implements IProjectModule {
  private projects: IProject[];
  private projectsMap: { [id: string]: IProject };

  constructor(application: IApplication, private client: IClient) {
    super();
  }

  async load() {
    const result = await this.client.projects.get(null);

    this.projects = _.sortBy(result.entities, project => project.name);
    this.projectsMap = ArrayHelper.toMap(this.projects, project => project.id);
  }

  getAll() {
    return [...this.projects];
  }

  get(project: IProject) {
    if (!project)
      return null;

    return this.projectsMap[project.id];
  }
}
