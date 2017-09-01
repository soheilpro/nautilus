import { BaseAction } from '../../actions';
import { IApplication, IMilestone } from '../../application';

export default class DeleteMilestoneAction extends BaseAction {
  constructor(private milestone: IMilestone, private application: IApplication) {
    super();
  }

  async execute() {
    await this.application.items.deleteMilestone(this.milestone);
  }
}
