import * as React from 'react';
import { Link } from 'react-router-dom';
import { ServiceManager } from '../../services';
import Avatar from '../avatar';
import { IApplication } from '../../application';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IHeaderProps {
}

interface IHeaderState {
}

export default class Header extends React.PureComponent<IHeaderProps, IHeaderState> {
  private application = ServiceManager.Instance.getService<IApplication>('IApplication');

  render() {
    const user = this.application.users.get(this.application.getSession().user);

    return (
      <div className="header-component">
        <div className="row">
          <div className="main">
            <Link className="title" to="/">nautilus</Link>
          </div>
          <div className="profile">
            <Avatar user={user} size={30} />
          </div>
        </div>
      </div>
    );
  }
};
