import * as React from 'react';
import * as classNames from 'classnames';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IIssueTitleFieldProps {
  title: string;
  status?: string;
}

interface IIssueTitleFieldState {
}

export default class IssueTitleField extends React.PureComponent<IIssueTitleFieldProps, IIssueTitleFieldState> {
  render(): JSX.Element {
    return (
      <span className={classNames('title-field-component', this.props.status ? `status-${this.props.status}` : null)}>
        {this.props.title}
      </span>
    );
  }
}
