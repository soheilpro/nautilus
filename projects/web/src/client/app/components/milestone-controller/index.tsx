import * as _ from 'underscore';
import * as React from 'react';
import * as NQL from '../../nql';
import { IMilestone, IMilestoneChange, IApplication } from '../../application';
import { IMilestoneController, MilestoneType } from '../../modules/milestones';
import { ServiceManager } from '../../services';
import AddEditMilestoneWindow from '../add-edit-milestone-window';
import { AddMilestoneAction, UpdateMilestoneAction, DeleteMilestoneAction } from '../../actions/milestones';
import { IActionManager } from '../../framework/actions';
import { IDialogController } from '../../framework/dialog';
import { INotificationController } from '../../framework/notifications';
import { IWindowController } from '../../framework/windows';
import { NewMilestoneCommand } from './commands';
import { ICommandProvider, ICommandManager } from '../../framework/commands';
import { IItemControllerManager } from '../../framework/items';

interface IMilestoneControllerProps {
}

interface IMilestoneControllerState {
}

export default class MilestoneController extends React.PureComponent<IMilestoneControllerProps, IMilestoneControllerState> implements IMilestoneController, ICommandProvider {
  private application = ServiceManager.Instance.getService<IApplication>('IApplication');
  private actionManager = ServiceManager.Instance.getService<IActionManager>('IActionManager');
  private windowController = ServiceManager.Instance.getService<IWindowController>('IWindowController');
  private dialogController = ServiceManager.Instance.getService<IDialogController>('IDialogController');
  private notificationController = ServiceManager.Instance.getService<INotificationController>('INotificationController');
  private itemControllerManager = ServiceManager.Instance.getService<IItemControllerManager>('IItemControllerManager');
  private commandManager = ServiceManager.Instance.getService<ICommandManager>('ICommandManager');

  constructor() {
    super();

    this.state = {};
  }

  componentWillMount() {
    ServiceManager.Instance.registerService('IMilestoneController', this);
    this.itemControllerManager.registerItemController(MilestoneType, this);
    this.commandManager.registerCommandProvider(this);
  }

  componentWillUnmount() {
    this.commandManager.unregisterCommandProvider(this);
    this.itemControllerManager.unregisterItemController(MilestoneType, this);
    ServiceManager.Instance.unregisterService('IMilestoneController', this);
  }

  getCommands() {
    return [
      new NewMilestoneCommand(),
    ];
  }

  createNew() {
    const handleAddMilestoneWindowAdd = async (milestone: IMilestone) => {
      this.windowController.closeWindow(addMilestoneWindow);

      const notification = {
        title: 'Adding milestone...',
      };

      this.notificationController.showNotification(notification);

      await this.actionManager.execute(new AddMilestoneAction(milestone, this.application));

      this.notificationController.hideNotification(notification);
    };

    const handleAddMilestoneWindowClose = () => {
      this.windowController.closeWindow(addMilestoneWindow);
    };

    const addMilestoneWindow = {
      content: <AddEditMilestoneWindow mode="add" onAdd={handleAddMilestoneWindowAdd} onClose={handleAddMilestoneWindowClose} />,
      top: 120,
      width: 800,
      modal: true,
    };

    this.windowController.showWindow(addMilestoneWindow);
  }

  editItem(milestone: IMilestone) {
    const handleEditMilestoneWindowUpdate = async (milestone: IMilestone, milestoneChange: IMilestoneChange) => {
      this.windowController.closeWindow(editMilestoneWindow);

      const notification = {
        title: 'Updating milestone...',
      };

      this.notificationController.showNotification(notification);

      await this.actionManager.execute(new UpdateMilestoneAction(milestone, milestoneChange, this.application));

      this.notificationController.hideNotification(notification);
    };

    const handleEditMilestoneWindowClose = () => {
      this.windowController.closeWindow(editMilestoneWindow);
    };

    const editMilestoneWindow = {
      content: <AddEditMilestoneWindow mode="edit" milestone={milestone} onUpdate={_.partial(handleEditMilestoneWindowUpdate, milestone)} onClose={handleEditMilestoneWindowClose} />,
      top: 120,
      width: 800,
      modal: true,
    };

    this.windowController.showWindow(editMilestoneWindow);
  }

  async deleteItem(milestone: IMilestone) {
    const filter = new NQL.ComparisonExpression(
      new NQL.LocalExpression('milestone'),
      new NQL.ConstantExpression(milestone, 'Milestone'),
      'eq'
    );

    const milestoneIssues = await this.application.items.getAllIssues(filter, null);

    if (milestoneIssues.length > 0) {
      this.dialogController.showErrorDialog({
        title: 'Delete Milestone',
        message: `Cannot delete milestone #${milestone.sid}.\nThere are ${milestoneIssues.length} issue(s) attached to this milestone.`},
      );

      return;
    }

    const handleConfirm = async () => {
      const notification = {
        title: 'Deleting milestone...',
      };

      this.notificationController.showNotification(notification);

      await this.actionManager.execute(new DeleteMilestoneAction(milestone, this.application));

      this.notificationController.hideNotification(notification);
    };

    this.dialogController.showConfirmDialog({
      title: 'Delete Milestone',
      message: `Are you sure you want to delete milestone #${milestone.sid}?`,
      buttonTitle: 'Delete Milestone',
      destructive: true,
      onConfirm: handleConfirm,
    });
  }

  getItemId(milestone: IMilestone) {
    return milestone.sid;
  }

  render() {
    return (
      <div className="milestone-controller-component">
      </div>
    );
  }
};
