import * as React from 'react';
import { IProject } from '../../application';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IProjectDetailProps {
  project: IProject;
}

interface IProjectDetailState {
}

export class ProjectDetail extends React.PureComponent<IProjectDetailProps, IProjectDetailState> {
  render(): JSX.Element {
    return (
      <div className="project-detail-component">
      </div>
    );
  }
}
