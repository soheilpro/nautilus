import * as React from 'react';
import * as classNames from 'classnames';
import { IUser } from '../../application';
import Select from '../../framework/components/select';

interface IUserSelectProps {
  users: IUser[];
  user: IUser;
  className?: string;
  onChange(user: IUser): void;
}

interface IUserSelectState {
}

export default class UserSelect extends React.PureComponent<IUserSelectProps, IUserSelectState> {
  constructor() {
    super();

    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  private handleSelectChange(user: IUser): void {
    this.props.onChange(user);
  }

  render(): JSX.Element {
    return (
      <Select className={classNames('user-select-component', this.props.className)} selectedItem={this.props.user} items={this.props.users} displayProperty="name" onChange={this.handleSelectChange} />
    );
  }
}
