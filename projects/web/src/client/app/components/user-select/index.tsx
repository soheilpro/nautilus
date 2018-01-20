import * as React from 'react';
import * as classNames from 'classnames';
import { IUser } from '../../application';
import { Select } from '../../framework/components/select';

interface IUserSelectProps {
  users: IUser[];
  user: IUser;
  className?: string;
  onChange(user: IUser): void;
}

interface IUserSelectState {
}

export class UserSelect extends React.PureComponent<IUserSelectProps, IUserSelectState> {
  render(): JSX.Element {
    return (
      <Select className={classNames('user-select-component', this.props.className)} selectedItem={this.props.user} items={this.props.users} keyForItem={(item: IUser) => item.id} titleForItem={(item: IUser) => item.name} onChange={this.props.onChange} />
    );
  }
}
