import { BaseAction } from '../../actions';
import { IApplication, IIssue } from '../../application';

export default class DeleteIssueAction extends BaseAction {
  constructor(private issue: IIssue, private application: IApplication) {
    super();
  }

  async execute() {
    await this.application.items.deleteIssue(this.issue);
  }
}
