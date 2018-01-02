import * as _ from 'underscore';
import * as React from 'react';
import { IUserRole, IUserRoleChange, IApplication } from '../../application';
import { IUserRoleController, UserRoleType } from '../../modules/user-roles';
import { ServiceManager } from '../../services';
import { IDialogController } from '../../framework/dialog';
import { INotificationController } from '../../framework/notifications';
import { IWindowController } from '../../framework/windows';
import { NewUserRoleCommand } from './commands';
import { ICommandProvider, ICommandManager, ICommand } from '../../framework/commands';
import { IItemControllerManager } from '../../framework/items';
import { AddEditUserRoleWindow } from '../add-edit-user-role-window';

interface IUserRoleControllerProps {
}

interface IUserRoleControllerState {
}

export class UserRoleController extends React.PureComponent<IUserRoleControllerProps, IUserRoleControllerState> implements IUserRoleController, ICommandProvider {
  private application = ServiceManager.Instance.getService<IApplication>('IApplication');
  private windowController = ServiceManager.Instance.getService<IWindowController>('IWindowController');
  private dialogController = ServiceManager.Instance.getService<IDialogController>('IDialogController');
  private notificationController = ServiceManager.Instance.getService<INotificationController>('INotificationController');
  private itemControllerManager = ServiceManager.Instance.getService<IItemControllerManager>('IItemControllerManager');
  private commandManager = ServiceManager.Instance.getService<ICommandManager>('ICommandManager');

  constructor() {
    super();

    this.state = {};
  }

  componentWillMount(): void {
    ServiceManager.Instance.registerService('IUserRoleController', this);
    this.itemControllerManager.registerItemController(UserRoleType, this);
    this.commandManager.registerCommandProvider(this);
  }

  componentWillUnmount(): void {
    this.commandManager.unregisterCommandProvider(this);
    this.itemControllerManager.unregisterItemController(UserRoleType, this);
    ServiceManager.Instance.unregisterService('IUserRoleController', this);
  }

  getCommands(): ICommand[] {
    return [
      new NewUserRoleCommand(),
    ];
  }

  createNew(): void {
    const handleAddUserRoleWindowAdd = async (userRole: IUserRole, window: AddEditUserRoleWindow) => {
      try {
        await this.application.userRoles.add(userRole);

        this.windowController.closeWindow(addUserRoleWindow);
      }
      catch (error) {
        window.showError({
          message: error.toString(),
        });
      }
    };

    const handleAddUserRoleWindowClose = () => {
      this.windowController.closeWindow(addUserRoleWindow);
    };

    const addUserRoleWindow = {
      content: <AddEditUserRoleWindow mode="add" onAdd={handleAddUserRoleWindowAdd} onClose={handleAddUserRoleWindowClose} />,
      top: 120,
      width: 800,
      modal: true,
    };

    this.windowController.showWindow(addUserRoleWindow);
  }

  editItem(userRole: IUserRole): void {
    const handleEditUserRoleWindowUpdate = async (userRole: IUserRole, userRoleChange: IUserRoleChange, window: AddEditUserRoleWindow) => {
      try {
        await this.application.userRoles.update(userRole, userRoleChange);

        this.windowController.closeWindow(editUserRoleWindow);
      }
      catch (error) {
        window.showError({
          message: error.toString(),
        });
      }
    };

    const handleEditUserRoleWindowClose = () => {
      this.windowController.closeWindow(editUserRoleWindow);
    };

    const editUserRoleWindow = {
      content: <AddEditUserRoleWindow mode="edit" userRole={userRole} onUpdate={_.partial(handleEditUserRoleWindowUpdate, userRole)} onClose={handleEditUserRoleWindowClose} />,
      top: 120,
      width: 800,
      modal: true,
    };

    this.windowController.showWindow(editUserRoleWindow);
  }

  async deleteItem(userRole: IUserRole): Promise<void> {
    const handleConfirm = async () => {
      const notification = {
        title: 'Deleting user role...',
      };

      this.notificationController.showNotification(notification);

      await this.application.userRoles.delete(userRole);

      this.notificationController.hideNotification(notification);
    };

    this.dialogController.showConfirmDialog({
      title: 'Delete User Role',
      message: `Are you sure you want to delete this user role?`,
      buttonTitle: 'Delete User Role',
      destructive: true,
      onConfirm: handleConfirm,
    });
  }

  getItemId(userRole: IUserRole): string {
    return userRole.id;
  }

  render(): JSX.Element {
    return (
      <div className="user-role-controller-component">
      </div>
    );
  }
}
