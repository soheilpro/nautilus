import { BaseCommand } from '../../../framework/commands';
import { KeyCode } from '../../../framework/keyboard';
import { ServiceManager } from '../../../services';
import { IIssueController } from '../../../modules/issues';

export class NewIssueCommand extends BaseCommand {
  private issueController = ServiceManager.Instance.getService<IIssueController>('IIssueController');

  get id() {
    return 'new-issue';
  }

  get title() {
    return 'New Issue';
  }

  get shortcut() {
    return [{ keyCode: KeyCode.N }];
  }

  execute() {
    this.issueController.createNew({});
  }
}
