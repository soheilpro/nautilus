import { BaseAction } from '../../framework/actions';
import { IApplication, IIssue } from '../../application';

export class DeleteIssueAction extends BaseAction {
  constructor(private issue: IIssue, private application: IApplication) {
    super();
  }

  async execute(): Promise<void> {
    await this.application.items.deleteIssue(this.issue);
  }
}
