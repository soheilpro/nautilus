import * as _ from 'underscore';
import * as React from 'react';
import * as NQL from '../../nql';
import { IMilestone, IMilestoneChange } from '../../application';
import { IMilestoneController } from '../../milestones';
import { ServiceManager } from '../../services';
import AddEditMilestoneWindow from '../add-edit-milestone-window';
import AddMilestoneAction from './add-milestone-action';
import UpdateMilestoneAction from './update-milestone-action';
import DeleteMilestoneAction from './delete-milestone-action';

interface IMilestoneControllerProps {
}

interface IMilestoneControllerState {
}

export default class MilestoneController extends React.PureComponent<IMilestoneControllerProps, IMilestoneControllerState> implements IMilestoneController {
  private application = ServiceManager.Instance.getApplication();
  private actionManager = ServiceManager.Instance.getActionManager();
  private windowController = ServiceManager.Instance.getWindowController();
  private dialogController = ServiceManager.Instance.getDialogController();
  private notificationController = ServiceManager.Instance.getNotificationController();

  constructor() {
    super();

    this.state = {};
  }

  componentWillMount() {
    ServiceManager.Instance.setMilestoneController(this);
  }

  componentWillUnmount() {
    ServiceManager.Instance.setMilestoneController(undefined);
  }

  addMilestone() {
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

  editMilestone(milestone: IMilestone) {
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

  async deleteMilestone(milestone: IMilestone) {
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

  render() {
    return (
      <div className="milestone-controller-component">
      </div>
    );
  }
};
