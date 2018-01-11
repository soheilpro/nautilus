import { BaseCommand } from '../../../framework/commands';
import { IProjectController } from '../../../modules/projects';

export class NewProjectCommand extends BaseCommand {
  constructor(private projectController: IProjectController) {
    super();
  }

  get id(): string {
    return 'new-project';
  }

  get title(): string {
    return 'New Project';
  }

  execute(): void {
    this.projectController.createProject();
  }
}
