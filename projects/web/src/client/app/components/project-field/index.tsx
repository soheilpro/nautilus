import * as React from 'react';
import * as classNames from 'classnames';
import { IProject } from '../../application';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IProjectFieldProps {
  project: IProject;
  className?: string;
}

interface IProjectFieldState {
}

export default class ProjectField extends React.PureComponent<IProjectFieldProps, IProjectFieldState> {
  render(): JSX.Element {
    if (!this.props.project)
      return null;

    return (
      <span className={classNames('project-field-component', this.props.className)}>
        {this.props.project.name}
      </span>
    );
  }
}
