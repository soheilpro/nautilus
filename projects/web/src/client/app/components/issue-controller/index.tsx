import * as _ from 'underscore';
import * as React from 'react';
import { IIssue, IIssueChange } from '../../application';
import { IIssueController } from '../../issues';
import { ServiceManager } from '../../services';
import AddEditIssueWindow from '../add-edit-issue-window';
import AddIssueAction from './add-issue-action';
import UpdateIssueAction from './update-issue-action';
import DeleteIssueAction from './delete-issue-action';

interface IIssueControllerProps {
}

interface IIssueControllerState {
}

export default class IssueController extends React.PureComponent<IIssueControllerProps, IIssueControllerState> implements IIssueController {
  private application = ServiceManager.Instance.getApplication();
  private actionManager = ServiceManager.Instance.getActionManager();
  private windowController = ServiceManager.Instance.getWindowController();
  private dialogController = ServiceManager.Instance.getDialogController();
  private notificationController = ServiceManager.Instance.getNotificationController();
  private lastIssueChange: IIssueChange;

  constructor() {
    super();

    this.state = {};
  }

  componentWillMount() {
    ServiceManager.Instance.setIssueController(this);
  }

  componentWillUnmount() {
    ServiceManager.Instance.setIssueController(undefined);
  }

  addIssue(issue: IIssue, parentIssue?: IIssue) {
    const handleAddIssueWindowAdd = async (issue: IIssue) => {
      this.windowController.closeWindow(addIssueWindow);

      const notification = {
        title: 'Adding issue...',
      };

      this.notificationController.showNotification(notification);

      await this.actionManager.execute(new AddIssueAction(issue, parentIssue, this.application));

      this.notificationController.hideNotification(notification);
    };

    const handleAddIssueWindowClose = () => {
      this.windowController.closeWindow(addIssueWindow);
    };

    const addIssueWindow = {
      content: <AddEditIssueWindow mode="add" issue={issue} parentIssue={parentIssue} onAdd={handleAddIssueWindowAdd} onClose={handleAddIssueWindowClose} />,
      top: 120,
      width: 800,
      modal: true,
    };

    this.windowController.showWindow(addIssueWindow);
  }

  editIssue(issue: IIssue) {
    const handleEditIssueWindowUpdate = async (issue: IIssue, issueChange: IIssueChange) => {
      this.windowController.closeWindow(editIssueWindow);

      const notification = {
        title: 'Editing issue...',
      };

      this.notificationController.showNotification(notification);

      await this.actionManager.execute(new UpdateIssueAction(issue, issueChange, this.application));
      this.lastIssueChange = issueChange;

      this.notificationController.hideNotification(notification);
    };

    const handleEditIssueWindowClose = async () => {
      this.windowController.closeWindow(editIssueWindow);
    };

    const editIssueWindow = {
      content: <AddEditIssueWindow mode="edit" issue={issue} onUpdate={_.partial(handleEditIssueWindowUpdate, issue)} onClose={handleEditIssueWindowClose} />,
      top: 120,
      width: 800,
      modal: true,
    };

    this.windowController.showWindow(editIssueWindow);
  }

  deleteIssue(issue: IIssue) {
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

  getLastIssueChange() {
    return this.lastIssueChange;
  }

  render() {
    return (
      <div className="issue-controller-component">
      </div>
    );
  }
};
