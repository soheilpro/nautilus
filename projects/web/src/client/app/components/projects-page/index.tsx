import * as _ from 'underscore';
import * as React from 'react';
import * as NQL from '../../nql';
import { IProject, entityComparer, IApplication } from '../../application';
import { ServiceManager } from '../../services';
import { ArrayHelper } from '../../utilities/array-helper';
import { ProjectViewSettings, IView, View } from '../project-view-settings';
import { ProjectDetail } from '../project-detail';
import { ProjectTable } from '../project-table';
import { MasterPage } from '../master-page';
import { CommandButton } from '../../framework/components/command-button';
import { Icon } from '../../framework/components/icon';
import { ILocalStorage } from '../../framework/storage';
import { IContextProvider, IContextManager, IContext } from '../../framework/context';
import { ProjectType } from '../../modules/projects';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IProjectsPageProps {
}

interface IProjectsPageState {
  projects?: IProject[];
  selectedProject?: IProject;
  view?: IView;
}

export class ProjectsPage extends React.Component<IProjectsPageProps, IProjectsPageState> implements IContextProvider {
  private localStorage = ServiceManager.Instance.getService<ILocalStorage>('ILocalStorage');
  private contextManager = ServiceManager.Instance.getService<IContextManager>('IContextManager');
  private application = ServiceManager.Instance.getService<IApplication>('IApplication');
  private projectDetailContainerRef: HTMLElement;

  constructor() {
    super();

    this.handleApplicationLoad = this.handleApplicationLoad.bind(this);
    this.handleApplicationProjectAdd = this.handleApplicationProjectAdd.bind(this);
    this.handleApplicationProjectUpdate = this.handleApplicationProjectUpdate.bind(this);
    this.handleApplicationProjectDelete = this.handleApplicationProjectDelete.bind(this);
    this.handleProjectViewSettingsChange = this.handleProjectViewSettingsChange.bind(this);
    this.handleProjectTableProjectSelect = this.handleProjectTableProjectSelect.bind(this);

    this.state = {
      projects: [],
      view: View.create(),
    };
  }

  componentWillMount(): void {
    this.contextManager.registerContextProvider(this);
    this.application.on('load', this.handleApplicationLoad);
    this.application.projects.on('project.add', this.handleApplicationProjectAdd);
    this.application.projects.on('project.update', this.handleApplicationProjectUpdate);
    this.application.projects.on('project.delete', this.handleApplicationProjectDelete);
  }

  async componentDidMount(): Promise<void> {
    ($(this.projectDetailContainerRef) as any).sticky({
      topSpacing: 10,
    });

    const view = View.fromJSON(await this.localStorage.get('projects.view', View.create().toJSON()));

    this.setState({
      view: view,
    });

    this.loadProjects(view.filterExpression, view.sortExpressions);
  }

  componentWillUnmount(): void {
    this.application.projects.off('project.delete', this.handleApplicationProjectDelete);
    this.application.projects.off('project.update', this.handleApplicationProjectUpdate);
    this.application.projects.off('project.add', this.handleApplicationProjectAdd);
    this.application.off('load', this.handleApplicationLoad);
    this.contextManager.unregisterContextProvider(this);
  }

  private loadProjects(filterExpression: NQL.IExpression, sortExpressions: NQL.ISortExpression[]): void {
    sortExpressions = [new NQL.SortExpression(new NQL.LocalExpression('name'))];

    const projects = this.application.projects.getAll(filterExpression, sortExpressions);

    let selectedProject = this.state.selectedProject ? _.find(projects, _.partial(entityComparer, this.state.selectedProject)) : null;

    if (!selectedProject)
      selectedProject = projects[0];

    this.setState({
      projects: projects,
      selectedProject: selectedProject,
    });
  }

  getContext(): IContext {
    if (!this.state.selectedProject)
      return null;

    return {
      'core.activeItemType': ProjectType,
      'core.activeItem': this.state.selectedProject,
    };
  }

  private handleApplicationLoad(): void {
    this.loadProjects(this.state.view.filterExpression, this.state.view.sortExpressions);
  }

  private handleApplicationProjectAdd({ project }: { project: IProject }): void {
    this.setState(state => {
      return {
        projects: [project, ...state.projects],
        selectedProject: project,
      };
    });
  }

  private handleApplicationProjectUpdate({ project }: { project: IProject }): void {
    this.setState(state => {
      return {
        projects: ArrayHelper.replaceElement(state.projects, project, project, entityComparer),
        selectedProject: project,
      };
    });
  }

  private handleApplicationProjectDelete({ project }: { project: IProject }): void {
    this.setState(state => {
      return {
        projects: ArrayHelper.removeElement(state.projects, project, entityComparer),
        selectedProject: undefined,
      };
    });
  }

  private handleProjectViewSettingsChange(view: IView): void {
    this.localStorage.set('projects.view', view.toJSON());

    this.setState({
      view: view,
    });

    this.loadProjects(view.filterExpression, view.sortExpressions);
  }

  private handleProjectTableProjectSelect(project: IProject): void {
    this.setState({
      selectedProject: project,
    });
  }

  render(): JSX.Element {
    return (
      <MasterPage>
        <div className="projects-page-component">
          <div className="action-bar">
            <CommandButton commandId="new-project"><Icon name="plus" position="before" /> New Project</CommandButton>
            <CommandButton commandId="refresh" type="secondary"><Icon name="refresh" /></CommandButton>
          </div>
          <div className="view-settings row">
            <ProjectViewSettings view={this.state.view} onChange={this.handleProjectViewSettingsChange} />
          </div>
          <div className="projects row">
            <div className="project-list">
              <ProjectTable projects={this.state.projects} selectedProject={this.state.selectedProject} onProjectSelect={this.handleProjectTableProjectSelect} />
            </div>
            <div className="divider"></div>
            <div className="project-detail">
              <div className="project-detail-container" ref={e => this.projectDetailContainerRef = e}>
              {
                this.state.selectedProject &&
                  <ProjectDetail project={this.state.selectedProject} />
              }
              </div>
            </div>
          </div>
        </div>
      </MasterPage>
    );
  }
}
