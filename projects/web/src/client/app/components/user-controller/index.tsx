import * as _ from 'underscore';
import * as React from 'react';
import { IUser, IUserChange, IApplication } from '../../application';
import { IUserController, UserType } from '../../modules/users';
import { ServiceManager } from '../../services';
import { IDialogController } from '../../framework/dialog';
import { INotificationController } from '../../framework/notifications';
import { IWindowController } from '../../framework/windows';
import { NewUserCommand } from './commands';
import { ICommandProvider, ICommandManager, ICommand } from '../../framework/commands';
import { IItemControllerManager } from '../../framework/items';
import AddEditUserWindow from '../add-edit-user-window';

interface IUserControllerProps {
}

interface IUserControllerState {
}

export default class UserController extends React.PureComponent<IUserControllerProps, IUserControllerState> implements IUserController, ICommandProvider {
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
    ServiceManager.Instance.registerService('IUserController', this);
    this.itemControllerManager.registerItemController(UserType, this);
    this.commandManager.registerCommandProvider(this);
  }

  componentWillUnmount(): void {
    this.commandManager.unregisterCommandProvider(this);
    this.itemControllerManager.unregisterItemController(UserType, this);
    ServiceManager.Instance.unregisterService('IUserController', this);
  }

  getCommands(): ICommand[] {
    return [
      new NewUserCommand(),
    ];
  }

  createNew(): void {
    const handleAddUserWindowAdd = async (user: IUser, window: AddEditUserWindow) => {
      try {
        await this.application.users.add(user);

        this.windowController.closeWindow(addUserWindow);
      }
      catch (error) {
        window.showError({
          message: error.toString(),
        });
      }
    };

    const handleAddUserWindowClose = () => {
      this.windowController.closeWindow(addUserWindow);
    };

    const addUserWindow = {
      content: <AddEditUserWindow mode="add" onAdd={handleAddUserWindowAdd} onClose={handleAddUserWindowClose} />,
      top: 120,
      width: 800,
      modal: true,
    };

    this.windowController.showWindow(addUserWindow);
  }

  editItem(user: IUser): void {
    const handleEditUserWindowUpdate = async (user: IUser, userChange: IUserChange, window: AddEditUserWindow) => {
      try {
        await this.application.users.update(user, userChange);

        this.windowController.closeWindow(editUserWindow);
      }
      catch (error) {
        window.showError({
          message: error.toString(),
        });
      }
    };

    const handleEditUserWindowClose = () => {
      this.windowController.closeWindow(editUserWindow);
    };

    const editUserWindow = {
      content: <AddEditUserWindow mode="edit" user={user} onUpdate={_.partial(handleEditUserWindowUpdate, user)} onClose={handleEditUserWindowClose} />,
      top: 120,
      width: 800,
      modal: true,
    };

    this.windowController.showWindow(editUserWindow);
  }

  async deleteItem(user: IUser): Promise<void> {
    const handleConfirm = async () => {
      const notification = {
        title: 'Deleting user...',
      };

      this.notificationController.showNotification(notification);

      await this.application.users.delete(user);

      this.notificationController.hideNotification(notification);
    };

    this.dialogController.showConfirmDialog({
      title: 'Delete User',
      message: `Are you sure you want to delete user "${user.name}"?`,
      buttonTitle: 'Delete User',
      destructive: true,
      onConfirm: handleConfirm,
    });
  }

  getItemId(user: IUser): string {
    return user.id;
  }

  render(): JSX.Element {
    return (
      <div className="user-controller-component">
      </div>
    );
  }
};
