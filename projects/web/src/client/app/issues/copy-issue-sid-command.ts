import { IIssue } from '../application';
import { BaseCommand } from '../commands';
import { ServiceManager } from '../services';
import Clipboard from '../utilities/clipboard';

export default class CopyIssueSidCommand extends BaseCommand {
  private notificationController = ServiceManager.Instance.getNotificationController();

  constructor(private issue: IIssue) {
    super();
  }

  get id() {
    return 'copy-issue-sid';
  }

  get title() {
    return 'Copy issue id to clipboard';
  }

  get enabled() {
    return !!this.issue;
  }

  execute() {
    Clipboard.copyText(this.issue.sid);

    this.notificationController.showNotification({
      title: 'Issue id copied to clipboard.',
      type: 'success',
    },
    {
      hideAfter: 2000
    });
  }
}
