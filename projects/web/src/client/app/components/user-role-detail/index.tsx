import * as React from 'react';
import { IUserRole } from '../../application';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IUserRoleDetailProps {
  userRole: IUserRole;
}

interface IUserRoleDetailState {
}

export class UserRoleDetail extends React.PureComponent<IUserRoleDetailProps, IUserRoleDetailState> {
  render(): JSX.Element {
    return (
      <div className="user-role-detail-component">
      </div>
    );
  }
}
