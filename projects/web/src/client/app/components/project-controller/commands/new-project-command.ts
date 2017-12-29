import { BaseCommand } from '../../../framework/commands';
import { ServiceManager } from '../../../services';
import { IProjectController } from '../../../modules/projects';

export class NewProjectCommand extends BaseCommand {
  private projectController = ServiceManager.Instance.getService<IProjectController>('IProjectController');

  get id(): string {
    return 'new-project';
  }

  get title(): string {
    return 'New Project';
  }

  execute(): void {
    this.projectController.createNew();
  }
}
