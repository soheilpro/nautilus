import * as React from 'react';
import * as classNames from 'classnames';
import { IUserRole } from '../../application';
import { ServiceManager } from '../../services';
import { Table } from '../../framework/components/table';
import { TableHeader } from './table-header';
import { TableRow } from './table-row';
import { TableFooter } from './table-footer';
import { IUserRoleController } from '../../modules/user-roles';

interface IUserRoleTableProps {
  userRoles?: IUserRole[];
  selectedUserRole?: IUserRole;
  className?: string;
  onUserRoleSelect?(userRole: IUserRole): void;
}

interface IUserRoleTableState {
  selectedUserRole?: IUserRole;
}

export class UserRoleTable extends React.PureComponent<IUserRoleTableProps, IUserRoleTableState> {
  private userRoleController = ServiceManager.Instance.getService<IUserRoleController>('IUserRoleController');

  constructor(props: IUserRoleTableProps) {
    super(props);

    this.handleTableItemSelect = this.handleTableItemSelect.bind(this);
    this.handleTableItemAction = this.handleTableItemAction.bind(this);
    this.handleTableItemDelete = this.handleTableItemDelete.bind(this);

    this.state = {
      selectedUserRole: props.selectedUserRole,
    };
  }

  componentWillReceiveProps(props: IUserRoleTableProps): void {
    if (this.props.selectedUserRole !== props.selectedUserRole) {
      this.setState({
        selectedUserRole: props.selectedUserRole,
      });
    }
  }

  private handleTableItemSelect(userRole: IUserRole): void {
    if (this.props.onUserRoleSelect)
      this.props.onUserRoleSelect(userRole);

    this.setState({
      selectedUserRole: userRole,
    });
  }

  private handleTableItemAction(userRole: IUserRole): void {
    return this.userRoleController.editItem(userRole);
  }

  private handleTableItemDelete(userRole: IUserRole): void {
    return this.userRoleController.deleteItem(userRole);
  }

  render(): JSX.Element {
    return (
      <Table className={classNames('user-role-table-component', this.props.className)} items={this.props.userRoles} selectedItem={this.state.selectedUserRole} Header={TableHeader} Row={TableRow} Footer={TableFooter} onItemSelect={this.handleTableItemSelect} onItemAction={this.handleTableItemAction} onItemDelete={this.handleTableItemDelete} />
    );
  }
}
