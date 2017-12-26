import { BaseAction } from '../../framework/actions';
import { IApplication, IIssue, IIssueChange } from '../../application';

export class UpdateIssueAction extends BaseAction {
  constructor(private issue: IIssue, private issueChange: IIssueChange, private application: IApplication) {
    super();
  }

  async execute(): Promise<void> {
    this.issue = await this.application.items.updateIssue(this.issue, this.issueChange);
  }
}
