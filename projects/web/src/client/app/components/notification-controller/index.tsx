import * as React from 'react';
import { ServiceManager } from '../../services';
import { INotification, INotificationController } from '../../notifications';
import { Notification } from './notification';

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

  private get commandController() {
    return ServiceManager.Instance.getCommandController();
  }

  constructor() {
    super();

    this.state = {
      notifications: [],
    };
  }

  componentWillMount() {
    ServiceManager.Instance.setNotificationController(this);
  }

  componentWillUnmount() {
    ServiceManager.Instance.setNotificationController(undefined);
  }

  showNotification(notification: INotification) {
    const extendedNotification: IExtendedNotification = notification;
    extendedNotification.key = this.notificationKeyCounter++;

    this.setState(state => ({
      notifications: [...state.notifications, extendedNotification],
    }));
  }

  hideNotification(notification: IExtendedNotification) {
    this.setState(state => ({
      notifications: state.notifications.filter(x => x !== notification),
    }));
  }

  render() {
    return (
      <div className="notification-controller-component">
        <div className="notificataion-container">
        {
          this.state.notifications.map((notification, index) => {
            return (
              <Notification title={notification.title} key={notification.key} />
            );
          })
        }
        </div>
      </div>
    );
  }
};
