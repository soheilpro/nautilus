import * as _ from 'underscore';
import * as React from 'react';
import * as NQL from '../../nql';
import { IMilestone, IMilestoneChange, IApplication, IProject } from '../../application';
import { IMilestoneController, MilestoneType } from '../../modules/milestones';
import { ServiceManager } from '../../services';
import { AddEditMilestoneWindow } from '../add-edit-milestone-window';
import { AddMilestoneAction, UpdateMilestoneAction, DeleteMilestoneAction } from '../../actions/milestones';
import { IActionManager } from '../../framework/actions';
import { IDialogController } from '../../framework/dialog';
import { INotificationController } from '../../framework/notifications';
import { IWindowController } from '../../framework/windows';
import { NewMilestoneCommand } from './commands';
import { ICommandProvider, ICommandManager, ICommand } from '../../framework/commands';
import { IItemControllerManager } from '../../framework/items';
import { MilestonePaletteWindow } from '../milestone-palette-window';

interface IMilestoneControllerProps {
}

interface IMilestoneControllerState {
}

export class MilestoneController extends React.PureComponent<IMilestoneControllerProps, IMilestoneControllerState> implements IMilestoneController, ICommandProvider {
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

  componentWillMount(): void {
    ServiceManager.Instance.registerService('IMilestoneController', this);
    this.itemControllerManager.registerItemController(MilestoneType, this);
    this.commandManager.registerCommandProvider(this);
  }

  componentWillUnmount(): void {
    this.commandManager.unregisterCommandProvider(this);
    this.itemControllerManager.unregisterItemController(MilestoneType, this);
    ServiceManager.Instance.unregisterService('IMilestoneController', this);
  }

  getCommands(): ICommand[] {
    return [
      new NewMilestoneCommand(this),
    ];
  }

  createMilestone(): void {
    const handleAdd = async (milestone: IMilestone) => {
      this.windowController.closeWindow(handle);

      const notification = {
        title: 'Adding milestone...',
      };

      this.notificationController.showNotification(notification);

      await this.actionManager.execute(new AddMilestoneAction(milestone, this.application));

      this.notificationController.hideNotification(notification);
    };

    const handleClose = () => {
      this.windowController.closeWindow(handle);
    };

    const window = <AddEditMilestoneWindow mode="add" onAdd={handleAdd} onClose={handleClose} />;
    const options = {
      top: 120,
      width: 800,
      modal: true,
    };

    const handle = this.windowController.showWindow(window, options);
  }

  editItem(milestone: IMilestone): void {
    const handleUpdate = async (milestone: IMilestone, milestoneChange: IMilestoneChange) => {
      this.windowController.closeWindow(handle);

      const notification = {
        title: 'Updating milestone...',
      };

      this.notificationController.showNotification(notification);

      await this.actionManager.execute(new UpdateMilestoneAction(milestone, milestoneChange, this.application));

      this.notificationController.hideNotification(notification);
    };

    const handleClose = () => {
      this.windowController.closeWindow(handle);
    };

    const window = <AddEditMilestoneWindow mode="edit" milestone={milestone} onUpdate={_.partial(handleUpdate, milestone)} onClose={handleClose} />;
    const options = {
      top: 120,
      width: 800,
      modal: true,
    };

    const handle = this.windowController.showWindow(window, options);
  }

  async deleteItem(milestone: IMilestone): Promise<void> {
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

  getItemId(milestone: IMilestone): string {
    return milestone.sid.toString();
  }

  selectMilestone(project: IProject): Promise<IMilestone> {
    let _resolve: (milestone: IMilestone) => void;

    const handleSelect = (milestone: IMilestone) => {
      this.windowController.closeWindow(handle, () => {
        _resolve(milestone);
      });
    };

    const milestones = this.application.items.getAllMilestones(null, [new NQL.SortExpression(new NQL.LocalExpression('fullTitle'))]);
    const validMilestones = this.application.items.filterValidMilestonesForProject(milestones, project);

    const window = <MilestonePaletteWindow milestones={validMilestones} onSelect={handleSelect} />;
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
      <div className="milestone-controller-component">
      </div>
    );
  }
}
