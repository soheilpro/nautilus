import * as React from 'react';
import { NavLink } from 'react-router-dom';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface INavigationProps {
}

interface INavigationState {
}

export class Navigation extends React.PureComponent<INavigationProps, INavigationState> {
  render(): JSX.Element {
    return (
      <div className="navigation-component">
        <NavLink to="/" exact activeClassName="active">Issues</NavLink>
        <NavLink to="/milestones" activeClassName="active">Milestones</NavLink>
        <NavLink to="/projects" className="right" activeClassName="active">Projects</NavLink>
        <NavLink to="/users" className="right" activeClassName="active">Users</NavLink>
      </div>
    );
  }
}
