import { BaseAction } from '../../framework/actions';
import { IApplication, IIssue } from '../../application';

export class AddIssueAction extends BaseAction {
  constructor(private issue: IIssue, private parentIssue: IIssue, private application: IApplication) {
    super();
  }

  async execute(): Promise<void> {
    await this.application.items.addIssue(this.issue, this.parentIssue);
  }
}
