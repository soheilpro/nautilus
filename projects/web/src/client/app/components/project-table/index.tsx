import * as React from 'react';
import * as classNames from 'classnames';
import { IProject } from '../../application';
import { ServiceManager } from '../../services';
import { Table } from '../../framework/components/table';
import { TableHeader } from './table-header';
import { TableRow } from './table-row';
import { TableFooter } from './table-footer';
import { IProjectController } from '../../modules/projects';

interface IProjectTableProps {
  projects?: IProject[];
  selectedProject?: IProject;
  className?: string;
  onProjectSelect?(project: IProject): void;
}

interface IProjectTableState {
  selectedProject?: IProject;
}

export class ProjectTable extends React.PureComponent<IProjectTableProps, IProjectTableState> {
  private projectController = ServiceManager.Instance.getService<IProjectController>('IProjectController');

  constructor(props: IProjectTableProps) {
    super(props);

    this.handleTableItemSelect = this.handleTableItemSelect.bind(this);
    this.handleTableItemAction = this.handleTableItemAction.bind(this);
    this.handleTableItemDelete = this.handleTableItemDelete.bind(this);

    this.state = {
      selectedProject: props.selectedProject,
    };
  }

  componentWillReceiveProps(props: IProjectTableProps): void {
    if (this.props.selectedProject !== props.selectedProject) {
      this.setState({
        selectedProject: props.selectedProject,
      });
    }
  }

  private handleTableItemSelect(project: IProject): void {
    if (this.props.onProjectSelect)
      this.props.onProjectSelect(project);

    this.setState({
      selectedProject: project,
    });
  }

  private handleTableItemAction(project: IProject): void {
    return this.projectController.editItem(project);
  }

  private handleTableItemDelete(project: IProject): void {
    return this.projectController.deleteItem(project);
  }

  render(): JSX.Element {
    return (
      <Table className={classNames('project-table-component', this.props.className)} items={this.props.projects} selectedItem={this.state.selectedProject} Header={TableHeader} Row={TableRow} Footer={TableFooter} onItemSelect={this.handleTableItemSelect} onItemAction={this.handleTableItemAction} onItemDelete={this.handleTableItemDelete} />
    );
  }
}
