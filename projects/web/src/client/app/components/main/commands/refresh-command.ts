import { BaseCommand } from '../../../framework/commands';
import { KeyCode, IShortcut } from '../../../framework/keyboard';
import { ServiceManager } from '../../../services';
import { IApplication } from '../../../application';
import { INotificationController } from '../../../framework/notifications';

export class RefreshCommand extends BaseCommand {
  private application = ServiceManager.Instance.getService<IApplication>('IApplication');
  private notificationController = ServiceManager.Instance.getService<INotificationController>('INotificationController');

  get id(): string {
    return 'refresh';
  }

  get title(): string {
    return 'Refresh';
  }

  get shortcut(): IShortcut {
    return [{ keyCode: KeyCode.R }];
  }

  async execute(): Promise<void> {
    const notification = {
      title: 'Refreshing...',
    };

    this.notificationController.showNotification(notification);

    await this.application.load();

    this.notificationController.hideNotification(notification);
  }
}
