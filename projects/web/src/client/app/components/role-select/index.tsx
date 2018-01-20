import * as React from 'react';
import * as classNames from 'classnames';
import { IRole } from '../../application/role';
import { Select } from '../../framework/components/select';

interface IRoleSelectProps {
  roles: IRole[];
  role: IRole;
  className?: string;
  onChange(role: IRole): void;
}

interface IRoleSelectState {
}

export class RoleSelect extends React.PureComponent<IRoleSelectProps, IRoleSelectState> {
  render(): JSX.Element {
    return (
      <Select className={classNames('role-select-component', this.props.className)} selectedItem={this.props.role} items={this.props.roles} keyForItem={(item: string) => item} titleForItem={(item: string) => item} onChange={this.props.onChange} />
    );
  }
}
