import { IIssue } from '../application';
import { BaseCommand } from '../commands';
import { KeyCode } from '../keyboard';
import { ServiceManager } from '../services';

export default class DuplicateIssueCommand extends BaseCommand {
  private issueController = ServiceManager.Instance.getIssueController();

  constructor(private templateIssue: IIssue) {
    super();
  }

  get id() {
    return 'duplicate-issue';
  }

  get title() {
    return 'Duplicate Issue';
  }

  get shortcut() {
    return [{ keyCode: KeyCode.N, shiftKey: true }];
  }

  get enabled() {
    return !!this.templateIssue;
  }

  execute() {
    const issue: IIssue = {
      title: this.templateIssue.title,
      description: this.templateIssue.description,
      type: this.templateIssue.type,
      state: this.templateIssue.state,
      project: this.templateIssue.project,
      assignedTo: this.templateIssue.assignedTo,
      milestone: this.templateIssue.milestone,
    };

    this.issueController.addIssue(issue, this.templateIssue.parent);
  }
}
