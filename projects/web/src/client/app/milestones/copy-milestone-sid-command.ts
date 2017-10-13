import { IMilestone } from '../application';
import { BaseCommand } from '../commands';
import { ServiceManager } from '../services';
import Clipboard from '../utilities/clipboard';

export default class CopyMilestoneSidCommand extends BaseCommand {
  private notificationController = ServiceManager.Instance.getNotificationController();

  constructor(private milestone: IMilestone) {
    super();
  }

  get id() {
    return 'copy-milestone-sid';
  }

  get title() {
    return 'Copy milestone id to clipboard';
  }

  get enabled() {
    return !!this.milestone;
  }

  execute() {
    Clipboard.copyText(this.milestone.sid);

    this.notificationController.showNotification({
      title: 'Milestone id copied to clipboard.',
      type: 'success',
    },
    {
      hideAfter: 2000
    });
  }
}
