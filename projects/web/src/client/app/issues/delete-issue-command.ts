import { IIssue } from '../application';
import { BaseCommand } from '../commands';
import { KeyCode } from '../keyboard';
import { ServiceManager } from '../services';

export default class DeleteIssueCommand extends BaseCommand {
  private issueController = ServiceManager.Instance.getIssueController();

  constructor(private issue: IIssue) {
    super();
  }

  get id() {
    return 'delete-issue';
  }

  get title() {
    return 'Delete Issue';
  }

  get shortcut() {
    return [{ keyCode: KeyCode.D }];
  }

  get enabled() {
    return !!this.issue;
  }

  execute() {
    this.issueController.deleteIssue(this.issue);
  }
}
