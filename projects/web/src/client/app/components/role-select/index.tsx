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
  constructor() {
    super();

    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  private handleSelectChange(role: IRole): void {
    this.props.onChange(role);
  }

  render(): JSX.Element {
    return (
      <Select className={classNames('role-select-component', this.props.className)} selectedItem={this.props.role} items={this.props.roles} itemKeyGetter={(item: string) => item} itemTitleGetter={(item: string) => item} onChange={this.handleSelectChange} />
    );
  }
}
