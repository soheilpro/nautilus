import { IIssue, IIssueChange } from '../application';
import { BaseCommand } from '../commands';
import { KeyCode } from '../keyboard';
import { ServiceManager } from '../services';
import UpdateIssueAction from '../components/issue-controller/update-issue-action';

export default class UpdateIssueCommand extends BaseCommand {
  private application = ServiceManager.Instance.getApplication();
  private actionManager = ServiceManager.Instance.getActionManager();

  constructor(private issue: IIssue, private issueChange: IIssueChange) {
    super();
  }

  get id() {
    return 'update-issue';
  }

  get title() {
    return 'Update Issue';
  }

  get shortcut() {
    return [
      { keyCode: KeyCode.U },
      { keyCode: KeyCode.U },
    ];
  }

  get enabled() {
    return !!this.issue && !!this.issueChange;
  }

  async execute() {
    const issueChange: IIssueChange = {
      type: this.issueChange.type,
      state: this.issueChange.state,
      tags: this.issueChange.tags,
      project: this.issueChange.project,
      milestone: this.issueChange.milestone,
      assignedTo: this.issueChange.assignedTo,
    };

    await this.actionManager.execute(new UpdateIssueAction(this.issue, issueChange, this.application));
  }
}
