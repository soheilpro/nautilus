import { BaseCommand } from '../../../framework/commands';
import { KeyCode } from '../../../framework/keyboard';
import { ServiceManager } from '../../../services';
import { IApplication } from '../../../application';
import { INotificationController } from '../../../framework/notifications';

export class RefreshCommand extends BaseCommand {
  private application = ServiceManager.Instance.getService<IApplication>('IApplication');
  private notificationController = ServiceManager.Instance.getService<INotificationController>('INotificationController');

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
