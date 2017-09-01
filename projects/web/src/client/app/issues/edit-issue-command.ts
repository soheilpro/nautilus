import { IIssue } from '../application';
import { BaseCommand } from '../commands';
import { KeyCode } from '../keyboard';
import { ServiceManager } from '../services';

export default class EditIssueCommand extends BaseCommand {
  private issueController = ServiceManager.Instance.getIssueController();

  constructor(private issue: IIssue) {
    super();
  }

  get id() {
    return 'edit-issue';
  }

  get title() {
    return 'Edit Issue';
  }

  get shortcut() {
    return [{ keyCode: KeyCode.E }];
  }

  get enabled() {
    return !!this.issue;
  }

  execute() {
    this.issueController.editIssue(this.issue);
  }
}
