import { INotification } from './inotification';

export interface INotificationController {
  showNotification(notification: INotification): void;
  hideNotification(notification: INotification): void;
}
