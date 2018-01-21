import * as _ from 'underscore';
import * as React from 'react';
import { IIssue, IIssueChange, IApplication, entityComparer } from '../../application';
import { IIssueController, IssueType } from '../../modules/issues';
import { ServiceManager } from '../../services';
import { IContextManager } from '../../framework/context';
import { AddIssueAction, UpdateIssueAction, DeleteIssueAction } from '../../actions/issues';
import { IActionManager } from '../../framework/actions';
import { IDialogController } from '../../framework/dialog';
import { INotificationController } from '../../framework/notifications';
import { IWindowController } from '../../framework/windows';
import { IUserController } from '../../modules/users';
import { ICommandProvider, ICommandManager, ICommand } from '../../framework/commands';
import { IItemStateController } from '../../modules/item-states';
import { DuplicateIssueCommand, NewIssueCommand, NewSubIssueCommand, RepeatUpdateIssueCommand, SetIssueStateCommand, SetIssueMilestoneCommand } from './commands';
import { IItemControllerManager } from '../../framework/items';
import { AddEditIssueWindow } from '../add-edit-issue-window';
import { AssignIssueCommand } from './commands/assign-issue-command';
import { IMilestoneController } from '../../modules/milestones';

interface IIssueControllerProps {
}

interface IIssueControllerState {
}

export class IssueController extends React.PureComponent<IIssueControllerProps, IIssueControllerState> implements IIssueController, ICommandProvider  {
  private application = ServiceManager.Instance.getService<IApplication>('IApplication');
  private contextManager = ServiceManager.Instance.getService<IContextManager>('IContextManager');
  private actionManager = ServiceManager.Instance.getService<IActionManager>('IActionManager');
  private windowController = ServiceManager.Instance.getService<IWindowController>('IWindowController');
  private dialogController = ServiceManager.Instance.getService<IDialogController>('IDialogController');
  private notificationController = ServiceManager.Instance.getService<INotificationController>('INotificationController');
  private itemControllerManager = ServiceManager.Instance.getService<IItemControllerManager>('IItemControllerManager');
  private commandManager = ServiceManager.Instance.getService<ICommandManager>('ICommandManager');
  private lastChange: IIssueChange;

  private get userController(): IUserController {
    return ServiceManager.Instance.getService<IUserController>('IUserController');
  }

  private get itemStateController(): IItemStateController {
    return ServiceManager.Instance.getService<IItemStateController>('IItemStateController');
  }

  private get milestoneController(): IMilestoneController {
    return ServiceManager.Instance.getService<IMilestoneController>('IMilestoneController');
  }

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
      new NewIssueCommand(this),
      new NewSubIssueCommand(this, this.contextManager),
      new DuplicateIssueCommand(this, this.contextManager),
      new RepeatUpdateIssueCommand(this, this.contextManager),
      new AssignIssueCommand(this, this.contextManager),
      new SetIssueStateCommand(this, this.contextManager),
      new SetIssueMilestoneCommand(this, this.contextManager),
    ];
  }

  createIssue(issue?: IIssue, parentIssue?: IIssue): void {
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

  duplicateIssue(issue: IIssue): void {
    const newIssue: IIssue = {
      title: issue.title,
      description: issue.description,
      type: issue.type,
      state: issue.state,
      project: issue.project,
      assignedTo: issue.assignedTo,
      milestone: issue.milestone,
    };

    this.createIssue(newIssue, issue.parent);
  }

  createSubIssue(issue: IIssue): void {
    const newIssue: IIssue = {
      type: _.find(this.application.itemTypes.getAll('issue'), itemType => itemType.key === 'task'),
      state: _.find(this.application.itemStates.getAll('issue'), itemType => itemType.key === 'todo'),
      project: issue.project,
      assignedTo: issue.assignedTo,
      milestone: issue.milestone,
    };

    this.createIssue(newIssue, issue);
  }

  applyLastChangeToIssue(issue: IIssue): void {
    const issueChange = this.getLastChange();

    const newIssueChange: IIssueChange = {
      type: issueChange.type,
      state: issueChange.state,
      tags: issueChange.tags,
      project: issueChange.project,
      milestone: issueChange.milestone,
      assignedTo: issueChange.assignedTo,
    };

    this.actionManager.execute(new UpdateIssueAction(issue, newIssueChange, this.application));
  }

  async assignIssue(issue: IIssue): Promise<void> {
    const user = await this.userController.selectUser();

    if (!user)
      return;

    if (entityComparer(user, issue.assignedTo))
      return;

    const issueChange: IIssueChange = {
      assignedTo: user,
    };

    this.updateIssue(issue, issueChange);
  }

  async setIssueState(issue: IIssue): Promise<void> {
    const state = await this.itemStateController.selectItemState('issue');

    if (!state)
      return;

    if (entityComparer(state, issue.state))
      return;

    const issueChange: IIssueChange = {
      state: state,
    };

    this.updateIssue(issue, issueChange);
  }

  async setIssueMilestone(issue: IIssue): Promise<void> {
    const milestone = await this.milestoneController.selectMilestone(issue.project);

    if (!milestone)
      return;

    if (entityComparer(milestone, issue.milestone))
      return;

    const issueChange: IIssueChange = {
      milestone: milestone,
    };

    this.updateIssue(issue, issueChange);
  }

  getLastChange(): IIssueChange {
    return this.lastChange;
  }

  editItem(issue: IIssue): void {
    const handleUpdate = async (issue: IIssue, issueChange: IIssueChange) => {
      this.windowController.closeWindow(handle);

      this.updateIssue(issue, issueChange);
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

  private async updateIssue(issue: IIssue, issueChange: IIssueChange): Promise<void> {
    const notification = {
      title: 'Updating issue...',
    };

    this.notificationController.showNotification(notification);

    await this.actionManager.execute(new UpdateIssueAction(issue, issueChange, this.application));
    this.lastChange = issueChange;

    this.notificationController.hideNotification(notification);
  }

  render(): JSX.Element {
    return (
      <div className="issue-controller-component">
      </div>
    );
  }
}
