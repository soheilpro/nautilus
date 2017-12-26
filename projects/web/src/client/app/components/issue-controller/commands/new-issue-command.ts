import { BaseCommand } from '../../../framework/commands';
import { KeyCode, IShortcut } from '../../../framework/keyboard';
import { ServiceManager } from '../../../services';
import { IIssueController } from '../../../modules/issues';

export class NewIssueCommand extends BaseCommand {
  private issueController = ServiceManager.Instance.getService<IIssueController>('IIssueController');

  get id(): string {
    return 'new-issue';
  }

  get title(): string {
    return 'New Issue';
  }

  get shortcut(): IShortcut {
    return [{ keyCode: KeyCode.N }];
  }

  execute(): void {
    this.issueController.createNew({});
  }
}
