import { BaseCommand } from '../../../framework/commands';
import { KeyCode, IShortcut } from '../../../framework/keyboard';
import { IApplication } from '../../../application';
import { INotificationController } from '../../../framework/notifications';

export class RefreshCommand extends BaseCommand {
  constructor(private application: IApplication, private notificationController: INotificationController) {
    super();
  }

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
