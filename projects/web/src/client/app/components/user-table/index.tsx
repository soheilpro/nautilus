import * as React from 'react';
import * as classNames from 'classnames';
import { IUser } from '../../application';
import { ServiceManager } from '../../services';
import Table from '../../framework/components/table';
import TableHeader from './table-header';
import TableRow from './table-row';
import TableFooter from './table-footer';
import { IUserController } from '../../modules/users';

interface IUserTableProps {
  users?: IUser[];
  selectedUser?: IUser;
  className?: string;
  onUserSelect?(user: IUser): void;
}

interface IUserTableState {
  selectedUser?: IUser;
}

export default class UserTable extends React.PureComponent<IUserTableProps, IUserTableState> {
  private userController = ServiceManager.Instance.getService<IUserController>('IUserController');

  constructor(props: IUserTableProps) {
    super(props);

    this.handleTableItemSelect = this.handleTableItemSelect.bind(this);
    this.handleTableItemAction = this.handleTableItemAction.bind(this);
    this.handleTableItemDelete = this.handleTableItemDelete.bind(this);

    this.state = {
      selectedUser: props.selectedUser,
    };
  }

  componentWillReceiveProps(props: IUserTableProps): void {
    if (this.props.selectedUser !== props.selectedUser) {
      this.setState({
        selectedUser: props.selectedUser,
      });
    }
  }

  private handleTableItemSelect(user: IUser): void {
    if (this.props.onUserSelect)
      this.props.onUserSelect(user);

    this.setState({
      selectedUser: user,
    });
  }

  private handleTableItemAction(user: IUser): void {
    return this.userController.editItem(user);
  }

  private handleTableItemDelete(user: IUser): void {
    return this.userController.deleteItem(user);
  }

  render(): JSX.Element {
    return (
      <Table className={classNames('user-table-component', this.props.className)} items={this.props.users} selectedItem={this.state.selectedUser} Header={TableHeader} Row={TableRow} Footer={TableFooter} onItemSelect={this.handleTableItemSelect} onItemAction={this.handleTableItemAction} onItemDelete={this.handleTableItemDelete} />
    );
  }
}
