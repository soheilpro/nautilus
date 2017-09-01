import * as React from 'react';
import { NavLink } from 'react-router-dom';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface INavigationProps {
}

interface INavigationState {
}

export default class Navigation extends React.PureComponent<INavigationProps, INavigationState> {
  render() {
    return (
      <div className="navigation-component">
        <NavLink to="/" exact activeClassName="active">Issues</NavLink>
        <NavLink to="/milestones" activeClassName="active">Milestones</NavLink>
      </div>
    );
  }
};
