import * as React from 'react';
import * as classNames from 'classnames';
import { IUser } from '../../application';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IUserFieldProps {
  user: IUser;
  className?: string;
}

interface IUserFieldState {
}

export default class UserField extends React.PureComponent<IUserFieldProps, IUserFieldState> {
  render(): JSX.Element {
    if (!this.props.user)
      return null;

    return (
      <span className={classNames('user-field-component', this.props.className)}>
        {this.props.user.name}
      </span>
    );
  }
}
