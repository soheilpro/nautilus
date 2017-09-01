import { BaseAction } from '../../actions';
import { IApplication, IIssue, IIssueChange } from '../../application';

export default class UpdateIssueAction extends BaseAction {
  constructor(private issue: IIssue, private issueChange: IIssueChange, private application: IApplication) {
    super();
  }

  async execute() {
    this.issue = await this.application.items.updateIssue(this.issue, this.issueChange);
  }
}
