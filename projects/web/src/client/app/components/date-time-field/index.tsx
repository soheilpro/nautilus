import * as React from 'react';
import * as classNames from 'classnames';
import * as moment from 'moment';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IDateTimeFieldProps {
  dateTime: Date;
  className?: string;
}

interface IDateTimeFieldState {
}

export default class DateTimeField extends React.PureComponent<IDateTimeFieldProps, IDateTimeFieldState> {
  render(): JSX.Element {
    if (!this.props.dateTime)
      return null;

    const dateTime = moment(this.props.dateTime);

    return (
      <span className={classNames('date-time-field-component', this.props.className)} title={dateTime.format('LLLL')}>
        {dateTime.fromNow()}
      </span>
    );
  }
}
