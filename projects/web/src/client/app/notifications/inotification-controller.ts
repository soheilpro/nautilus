import { INotification } from './inotification';
import { INotificationOptions } from './inotification-options';

export interface INotificationController {
  showNotification(notification: INotification, options?: INotificationOptions): void;
  hideNotification(notification: INotification): void;
}
