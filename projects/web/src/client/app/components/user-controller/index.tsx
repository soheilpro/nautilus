import * as _ from 'underscore';
import * as React from 'react';
import * as NQL from '../../nql';
import { IUser, IUserChange, IApplication } from '../../application';
import { IUserController, UserType } from '../../modules/users';
import { ServiceManager } from '../../services';
import { IDialogController } from '../../framework/dialog';
import { INotificationController } from '../../framework/notifications';
import { IWindowController } from '../../framework/windows';
import { NewUserCommand } from './commands';
import { ICommandProvider, ICommandManager, ICommand } from '../../framework/commands';
import { IItemControllerManager } from '../../framework/items';
import { AddEditUserWindow } from '../add-edit-user-window';
import { UserPaletteWindow } from '../user-palette-window';

interface IUserControllerProps {
}

interface IUserControllerState {
  isAdmin: boolean;
}

export class UserController extends React.PureComponent<IUserControllerProps, IUserControllerState> implements IUserController, ICommandProvider {
  private application = ServiceManager.Instance.getService<IApplication>('IApplication');
  private windowController = ServiceManager.Instance.getService<IWindowController>('IWindowController');
  private dialogController = ServiceManager.Instance.getService<IDialogController>('IDialogController');
  private notificationController = ServiceManager.Instance.getService<INotificationController>('INotificationController');
  private itemControllerManager = ServiceManager.Instance.getService<IItemControllerManager>('IItemControllerManager');
  private commandManager = ServiceManager.Instance.getService<ICommandManager>('ICommandManager');

  constructor() {
    super();

    this.state = {
      isAdmin: this.application.getUserPermissions().some(permission => permission === 'admin'),
    };
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
    if (!this.state.isAdmin)
      return [];

    return [
      new NewUserCommand(),
    ];
  }

  createNew(): void {
    const handleAdd = async (user: IUser, window: AddEditUserWindow) => {
      try {
        await this.application.users.add(user);

        this.windowController.closeWindow(handle);
      }
      catch (error) {
        window.showError({
          message: error.toString(),
        });
      }
    };

    const handleClose = () => {
      this.windowController.closeWindow(handle);
    };

    const window = <AddEditUserWindow mode="add" onAdd={handleAdd} onClose={handleClose} />;
    const options = {
      top: 120,
      width: 800,
      modal: true,
    };

    const handle = this.windowController.showWindow(window, options);
  }

  editItem(user: IUser): void {
    const handleUpdate = async (user: IUser, userChange: IUserChange, window: AddEditUserWindow) => {
      try {
        await this.application.users.update(user, userChange);

        this.windowController.closeWindow(handle);
      }
      catch (error) {
        window.showError({
          message: error.toString(),
        });
      }
    };

    const handleClose = () => {
      this.windowController.closeWindow(handle);
    };

    const window = <AddEditUserWindow mode="edit" user={user} onUpdate={_.partial(handleUpdate, user)} onClose={handleClose} />;
    const options = {
      top: 120,
      width: 800,
      modal: true,
    };

    const handle = this.windowController.showWindow(window, options);
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

  selectUser(): Promise<IUser> {
    let _resolve: (user: IUser) => void;

    const handleSelect = (user: IUser) => {
      this.windowController.closeWindow(handle, () => {
        _resolve(user);
      });
    };

    const users = this.application.users.getAll(null, [new NQL.SortExpression(new NQL.LocalExpression('username'))]);

    const window = <UserPaletteWindow users={users} onSelect={handleSelect} />;
    const options = {
      top: 20,
      width: 600,
    };

    const handle = this.windowController.showWindow(window, options);

    return new Promise(resolve => {
      _resolve = resolve;
    });
  }

  render(): JSX.Element {
    return (
      <div className="user-controller-component">
      </div>
    );
  }
}
