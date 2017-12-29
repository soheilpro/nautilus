import * as React from 'react';
import { ServiceManager } from '../../../services';
import { INotification, INotificationController, INotificationOptions } from '../../notifications';
import { Notification } from './notification';
import { ICommandController } from '../../commands';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IExtendedNotification extends INotification {
  key?: number;
}

interface INotificationControllerProps {
}

interface INotificationControllerState {
  notifications?: IExtendedNotification[];
}

export default class NotificationController extends React.PureComponent<INotificationControllerProps, INotificationControllerState> implements INotificationController {
  private notificationKeyCounter = 0;

  private get commandController(): ICommandController {
    return ServiceManager.Instance.getService<ICommandController>('ICommandController');
  }

  constructor() {
    super();

    this.state = {
      notifications: [],
    };
  }

  componentWillMount(): void {
    ServiceManager.Instance.registerService('INotificationController', this);
  }

  componentWillUnmount(): void {
    ServiceManager.Instance.unregisterService('INotificationController', this);
  }

  showNotification(notification: INotification, options: INotificationOptions = {}): void {
    if (!notification.type)
      notification.type = 'info';

    const extendedNotification: IExtendedNotification = notification;
    extendedNotification.key = this.notificationKeyCounter++;

    this.setState(state => ({
      notifications: [...state.notifications, extendedNotification],
    }));

    if (options.hideAfter)
      setTimeout(() => { this.hideNotification(notification); }, options.hideAfter);
  }

  hideNotification(notification: IExtendedNotification): void {
    this.setState(state => ({
      notifications: state.notifications.filter(x => x !== notification),
    }));
  }

  render(): JSX.Element {
    return (
      <div className="notification-controller-component">
        <div className="notificataion-container">
        {
          this.state.notifications.map((notification, index) => {
            return (
              <Notification notification={notification} key={notification.key} />
            );
          })
        }
        </div>
      </div>
    );
  }
}
