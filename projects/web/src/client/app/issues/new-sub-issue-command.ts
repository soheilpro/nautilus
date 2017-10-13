import * as _ from 'underscore';
import { IIssue } from '../application';
import { BaseCommand } from '../commands';
import { KeyCode } from '../keyboard';
import { ServiceManager } from '../services';

export default class NewSubIssueCommand extends BaseCommand {
  private application = ServiceManager.Instance.getApplication();
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
    const issue: IIssue = {
      type: _.find(this.application.itemTypes.getAll('issue'), itemType => itemType.key === 'task'),
      state: _.find(this.application.itemStates.getAll('issue'), itemType => itemType.key === 'todo'),
      project: this.parentIssue.project,
      assignedTo: this.parentIssue.assignedTo,
      milestone: this.parentIssue.milestone,
    };

    this.issueController.addIssue(issue, this.parentIssue);
  }
}
