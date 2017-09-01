import { IIssue } from '../application';
import { BaseCommand } from '../commands';
import { KeyCode } from '../keyboard';
import { ServiceManager } from '../services';

export default class NewSubIssueCommand extends BaseCommand {
  private issueController = ServiceManager.Instance.getIssueController();

  constructor(private parentIssue: IIssue) {
    super();
  }

  get id() {
    return 'new-sub-issue';
  }

  get title() {
    return 'New Sub-Issue';
  }

  get shortcut() {
    return [{ keyCode: KeyCode.S }];
  }

  get enabled() {
    return !!this.parentIssue;
  }

  execute() {
    this.issueController.addIssue({}, this.parentIssue);
  }
}
