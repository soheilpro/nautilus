import * as _ from 'underscore';
import * as React from 'react';
import { IProject, IProjectChange, IApplication } from '../../application';
import { IProjectController, ProjectType } from '../../modules/projects';
import { ServiceManager } from '../../services';
import { IDialogController } from '../../framework/dialog';
import { INotificationController } from '../../framework/notifications';
import { IWindowController } from '../../framework/windows';
import { NewProjectCommand } from './commands';
import { ICommandProvider, ICommandManager, ICommand } from '../../framework/commands';
import { IItemControllerManager } from '../../framework/items';
import { AddEditProjectWindow } from '../add-edit-project-window';

interface IProjectControllerProps {
}

interface IProjectControllerState {
  isAdmin: boolean;
}

export class ProjectController extends React.PureComponent<IProjectControllerProps, IProjectControllerState> implements IProjectController, ICommandProvider {
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
    ServiceManager.Instance.registerService('IProjectController', this);
    this.itemControllerManager.registerItemController(ProjectType, this);
    this.commandManager.registerCommandProvider(this);
  }

  componentWillUnmount(): void {
    this.commandManager.unregisterCommandProvider(this);
    this.itemControllerManager.unregisterItemController(ProjectType, this);
    ServiceManager.Instance.unregisterService('IProjectController', this);
  }

  getCommands(): ICommand[] {
    if (!this.state.isAdmin)
      return [];

    return [
      new NewProjectCommand(this),
    ];
  }

  createNew(): void {
    const handleAdd = async (project: IProject, window: AddEditProjectWindow) => {
      try {
        await this.application.projects.add(project);

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

    const window = <AddEditProjectWindow mode="add" onAdd={handleAdd} onClose={handleClose} />;
    const options = {
      top: 120,
      width: 800,
      modal: true,
    };

    const handle = this.windowController.showWindow(window, options);
  }

  editItem(project: IProject): void {
    const handleUpdate = async (project: IProject, projectChange: IProjectChange, window: AddEditProjectWindow) => {
      try {
        await this.application.projects.update(project, projectChange);

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

    const window = <AddEditProjectWindow mode="edit" project={project} onUpdate={_.partial(handleUpdate, project)} onClose={handleClose} />;
    const options = {
      top: 120,
      width: 800,
      modal: true,
    };

    const handle = this.windowController.showWindow(window, options);
  }

  async deleteItem(project: IProject): Promise<void> {
    const handleConfirm = async () => {
      const notification = {
        title: 'Deleting project...',
      };

      this.notificationController.showNotification(notification);

      await this.application.projects.delete(project);

      this.notificationController.hideNotification(notification);
    };

    this.dialogController.showConfirmDialog({
      title: 'Delete Project',
      message: `Are you sure you want to delete project "${project.name}"?`,
      buttonTitle: 'Delete Project',
      destructive: true,
      onConfirm: handleConfirm,
    });
  }

  getItemId(project: IProject): string {
    return project.id;
  }

  render(): JSX.Element {
    return (
      <div className="project-controller-component">
      </div>
    );
  }
}
