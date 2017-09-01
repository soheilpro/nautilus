import { BaseCommand } from '../commands';
import { KeyCode } from '../keyboard';
import { ServiceManager } from '../services';

export default class NewIssueCommand extends BaseCommand {
  private issueController = ServiceManager.Instance.getIssueController();

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
    this.issueController.addIssue({});
  }
}
