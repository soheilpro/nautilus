import * as React from 'react';

require('../../assets/stylesheets/base.less');
require('./notification.less');

interface INotificationProps {
  title: string;
}

interface INotificationState {
}

export class Notification extends React.PureComponent<INotificationProps, INotificationState> {
  render() {
    return (
      <div className="notification-component">
        <div className="wrapper">
          <span className="title">
            {this.props.title}
          </span>
        </div>
      </div>
    );
  }
};
