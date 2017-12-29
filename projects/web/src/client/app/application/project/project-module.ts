import * as NQL from '../../nql';
import { IClient, IProject, IProjectChange } from '../../sdk';
import { IApplication } from '../iapplication';
import { ArrayHelper } from '../../utilities/array-helper';
import { BaseModule } from '../base-module';
import { IProjectModule } from './iproject-module';
import { ProjectExpressionNormalizer } from './project-expression-normalizer';

export class ProjectModule extends BaseModule implements IProjectModule {
  private projects: IProject[];
  private projectsMap: { [id: string]: IProject };

  constructor(application: IApplication, private client: IClient) {
    super();
  }

  async load(): Promise<void> {
    const result = await this.client.projects.get(null);

    this.projects = result.entities;
    this.projectsMap = ArrayHelper.toMap(this.projects, project => project.id);
  }

  getAll(filterExpression: NQL.IExpression, sortExpressions: NQL.ISortExpression[]): IProject[] {
    let projects = [...this.projects];

    const expressionNormalizer = new ProjectExpressionNormalizer();

    if (filterExpression)
      projects = this.filter(projects, filterExpression, expressionNormalizer);

    if (sortExpressions)
      projects = this.sort(projects, sortExpressions, expressionNormalizer);

    return projects;
  }

  get(project: IProject): IProject {
    if (!project)
      return null;

    return this.projectsMap[project.id];
  }

  async add(project: IProject): Promise<IProject> {
    const newProject: IProject = {
      name: project.name,
      description: project.description,
      tags: project.tags,
    };

    const addedProject = await this.client.projects.insert(newProject);

    this.projects.push(addedProject);
    this.projectsMap[addedProject.id] = addedProject;

    this.emit('project.add', { project: addedProject });

    return addedProject;
  }

  async update(project: IProject, projectChange: IProjectChange): Promise<IProject> {
    const change: IProjectChange = {
      name: projectChange.name,
      description: projectChange.description,
      tags: projectChange.tags,
    };

    const updatedProject = await this.client.projects.update(project.id, change);

    this.projects[this.projects.indexOf(project)] = updatedProject;
    this.projectsMap[updatedProject.id] = updatedProject;

    this.emit('project.update', { project: updatedProject });

    return updatedProject;
  }

  async delete(project: IProject): Promise<void> {
    await this.client.projects.delete(project.id);

    this.projects.splice(this.projects.indexOf(project), 1);
    delete this.projectsMap[project.id];

    this.emit('project.delete', { project: project });
  }
}
