import * as React from 'react';
import * as classNames from 'classnames';
import { INotification } from '../../notifications';

require('../../assets/stylesheets/base.less');
require('./notification.less');

interface INotificationProps {
  notification: INotification;
}

interface INotificationState {
}

export class Notification extends React.PureComponent<INotificationProps, INotificationState> {
  render() {
    return (
      <div className="notification-component">
        <div className={classNames('wrapper', `type-${this.props.notification.type}`)}>
          <span className="title">
            {this.props.notification.title}
          </span>
        </div>
      </div>
    );
  }
};
