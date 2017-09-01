import { BaseAction } from '../../actions';
import { IApplication, IMilestone, IMilestoneChange } from '../../application';

export default class UpdateMilestoneAction extends BaseAction {
  constructor(private milestone: IMilestone, private milestoneChange: IMilestoneChange, private application: IApplication) {
    super();
  }

  async execute() {
    this.milestone = await this.application.items.updateMilestone(this.milestone, this.milestoneChange);
  }
}
