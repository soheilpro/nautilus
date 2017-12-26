import { BaseAction } from '../../framework/actions';
import { IApplication, IMilestone } from '../../application';

export class DeleteMilestoneAction extends BaseAction {
  constructor(private milestone: IMilestone, private application: IApplication) {
    super();
  }

  async execute(): Promise<void> {
    await this.application.items.deleteMilestone(this.milestone);
  }
}
