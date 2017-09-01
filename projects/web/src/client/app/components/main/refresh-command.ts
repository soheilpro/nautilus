import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';
import { ServiceManager } from '../../services';

export default class RefreshCommand extends BaseCommand {
  private application = ServiceManager.Instance.getApplication();
  private notificationController = ServiceManager.Instance.getNotificationController();

  get id() {
    return 'refresh';
  }

  get title() {
    return 'Refresh';
  }

  get shortcut() {
    return [{ keyCode: KeyCode.R }];
  }

  async execute() {
    const notification = {
      title: 'Refreshing...',
    };

    this.notificationController.showNotification(notification);

    await this.application.load();

    this.notificationController.hideNotification(notification);
  }
}
