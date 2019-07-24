import * as React from 'react';
import * as classNames from 'classnames';
import { IUser } from '../../application';
import { Avatar } from '../avatar';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IUserFieldProps {
  user: IUser;
  className?: string;
}

interface IUserFieldState {
}

export class UserField extends React.PureComponent<IUserFieldProps, IUserFieldState> {
  render(): JSX.Element {
    if (!this.props.user)
      return null;

    return (
      <span className={classNames('user-field-component', this.props.className)}>
        <span className="avatar">
          <Avatar user={this.props.user} size={15} />
        </span>
        <span className="name">
          {this.props.user.name}
        </span>
      </span>
    );
  }
}
