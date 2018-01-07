import * as _ from 'underscore';
import * as React from 'react';
import { IIssue, IIssueChange, IApplication } from '../../application';
import { IIssueController, IssueType } from '../../modules/issues';
import { ServiceManager } from '../../services';
import { AddIssueAction, UpdateIssueAction, DeleteIssueAction } from '../../actions/issues';
import { IActionManager } from '../../framework/actions';
import { IDialogController } from '../../framework/dialog';
import { INotificationController } from '../../framework/notifications';
import { IWindowController } from '../../framework/windows';
import { ICommandProvider, ICommandManager, ICommand } from '../../framework/commands';
import { DuplicateIssueCommand, NewIssueCommand, NewSubIssueCommand, RepeatUpdateIssueCommand } from './commands';
import { IItemControllerManager } from '../../framework/items';
import { AddEditIssueWindow } from '../add-edit-issue-window';

interface IIssueControllerProps {
}

interface IIssueControllerState {
}

export class IssueController extends React.PureComponent<IIssueControllerProps, IIssueControllerState> implements IIssueController, ICommandProvider  {
  private application = ServiceManager.Instance.getService<IApplication>('IApplication');
  private actionManager = ServiceManager.Instance.getService<IActionManager>('IActionManager');
  private windowController = ServiceManager.Instance.getService<IWindowController>('IWindowController');
  private dialogController = ServiceManager.Instance.getService<IDialogController>('IDialogController');
  private notificationController = ServiceManager.Instance.getService<INotificationController>('INotificationController');
  private itemControllerManager = ServiceManager.Instance.getService<IItemControllerManager>('IItemControllerManager');
  private commandManager = ServiceManager.Instance.getService<ICommandManager>('ICommandManager');
  private lastChange: IIssueChange;

  constructor() {
    super();

    this.state = {};
  }

  componentWillMount(): void {
    ServiceManager.Instance.registerService('IIssueController', this);
    this.itemControllerManager.registerItemController(IssueType, this);
    this.commandManager.registerCommandProvider(this);
  }

  componentWillUnmount(): void {
    this.commandManager.unregisterCommandProvider(this);
    this.itemControllerManager.unregisterItemController(IssueType, this);
    ServiceManager.Instance.unregisterService('IIssueController', this);
  }

  getCommands(): ICommand[] {
    return [
      new NewIssueCommand(),
      new NewSubIssueCommand(),
      new DuplicateIssueCommand(),
      new RepeatUpdateIssueCommand(this),
    ];
  }

  createNew(issue: IIssue, parentIssue?: IIssue): void {
    const handleAdd = async (issue: IIssue) => {
      this.windowController.closeWindow(handle);

      const notification = {
        title: 'Adding issue...',
      };

      this.notificationController.showNotification(notification);

      await this.actionManager.execute(new AddIssueAction(issue, parentIssue, this.application));

      this.notificationController.hideNotification(notification);
    };

    const handleClose = () => {
      this.windowController.closeWindow(handle);
    };

    const window = <AddEditIssueWindow mode="add" issue={issue} parentIssue={parentIssue} onAdd={handleAdd} onClose={handleClose} />;
    const options = {
      top: 120,
      width: 800,
      modal: true,
    };

    const handle = this.windowController.showWindow(window, options);
  }

  editItem(issue: IIssue): void {
    const handleUpdate = async (issue: IIssue, issueChange: IIssueChange) => {
      this.windowController.closeWindow(handle);

      const notification = {
        title: 'Editing issue...',
      };

      this.notificationController.showNotification(notification);

      await this.actionManager.execute(new UpdateIssueAction(issue, issueChange, this.application));
      this.lastChange = issueChange;

      this.notificationController.hideNotification(notification);
    };

    const handleClose = async () => {
      this.windowController.closeWindow(handle);
    };

    const window = <AddEditIssueWindow mode="edit" issue={issue} onUpdate={_.partial(handleUpdate, issue)} onClose={handleClose} />;
    const options = {
      top: 120,
      width: 800,
      modal: true,
    };

    const handle = this.windowController.showWindow(window, options);
  }

  deleteItem(issue: IIssue): void {
    const handleConfirm = async () => {
      const notification = {
        title: 'Deleting issue...',
      };

      this.notificationController.showNotification(notification);

      await this.actionManager.execute(new DeleteIssueAction(issue, this.application));

      this.notificationController.hideNotification(notification);
    };

    this.dialogController.showConfirmDialog({
      title: 'Delete Issue',
      message: `Are you sure you want to delete issue #${issue.sid}?`,
      buttonTitle: 'Delete Issue',
      destructive: true,
      onConfirm: handleConfirm,
    });
  }

  getItemId(item: IIssue): string {
    return item.sid;
  }

  getLastChange(): IIssueChange {
    return this.lastChange;
  }

  render(): JSX.Element {
    return (
      <div className="issue-controller-component">
      </div>
    );
  }
}
