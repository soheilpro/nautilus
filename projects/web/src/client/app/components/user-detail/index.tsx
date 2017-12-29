import * as React from 'react';
import { IUser } from '../../application';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IUserDetailProps {
  user: IUser;
}

interface IUserDetailState {
}

export class UserDetail extends React.PureComponent<IUserDetailProps, IUserDetailState> {
  render(): JSX.Element {
    return (
      <div className="user-detail-component">
      </div>
    );
  }
}
