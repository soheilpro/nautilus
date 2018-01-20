import * as React from 'react';
import * as classNames from 'classnames';
import { IProject } from '../../application';
import { Select } from '../../framework/components/select';

interface IProjectSelectProps {
  projects: IProject[];
  project: IProject;
  className?: string;
  onChange(project: IProject): void;
}

interface IProjectSelectState {
}

export class ProjectSelect extends React.PureComponent<IProjectSelectProps, IProjectSelectState> {
  constructor() {
    super();

    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  private handleSelectChange(project: IProject): void {
    this.props.onChange(project);
  }

  render(): JSX.Element {
    return (
      <Select className={classNames('project-select-component', this.props.className)} selectedItem={this.props.project} items={this.props.projects} keyForItem={(item: IProject) => item.id} titleForItem={(item: IProject) => item.name} onChange={this.handleSelectChange} />
    );
  }
}
