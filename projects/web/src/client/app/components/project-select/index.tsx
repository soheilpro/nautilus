import * as React from 'react';
import * as classNames from 'classnames';
import { IProject } from '../../application';
import Select from '../../framework/components/select';

interface IProjectSelectProps {
  projects: IProject[];
  project: IProject;
  className?: string;
  onChange(project: IProject): void;
}

interface IProjectSelectState {
}

export default class ProjectSelect extends React.PureComponent<IProjectSelectProps, IProjectSelectState> {
  constructor() {
    super();

    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  private handleSelectChange(project: IProject) {
    this.props.onChange(project);
  }

  render() {
    return (
      <Select className={classNames('project-select-component', this.props.className)} selectedItem={this.props.project} items={this.props.projects} displayProperty="name" onChange={this.handleSelectChange} />
    );
  }
};
