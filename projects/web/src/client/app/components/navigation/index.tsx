import * as React from 'react';
import { ServiceManager } from '../../services';
import { IApplication } from '../../application';
import { NavLink } from 'react-router-dom';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface INavigationProps {
}

interface INavigationState {
  isAdmin: boolean;
}

export class Navigation extends React.PureComponent<INavigationProps, INavigationState> {
  private application = ServiceManager.Instance.getService<IApplication>('IApplication');

  constructor() {
    super();

    this.state = {
      isAdmin: this.application.getUserPermissions().some(permission => permission === 'admin'),
    };
  }

  render(): JSX.Element {
    let links: JSX.Element[] = [
      <NavLink to="/" exact activeClassName="active" key="issues">Issues</NavLink>,
      <NavLink to="/milestones" activeClassName="active" key="milestones">Milestones</NavLink>,
    ];

    if (this.state.isAdmin) {
      links = [
        ...links,
        <NavLink to="/user-roles" className="right" activeClassName="active" key="user-roles">User Roles</NavLink>,
        <NavLink to="/projects" className="right" activeClassName="active" key="projects">Projects</NavLink>,
        <NavLink to="/users" className="right" activeClassName="active" key="users">Users</NavLink>,
      ];
    }
    return (
      <div className="navigation-component">
        { links }
      </div>
    );
  }
}
