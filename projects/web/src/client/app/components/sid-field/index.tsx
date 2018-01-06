import * as React from 'react';
import * as classNames from 'classnames';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface ISidFieldProps {
  sid: string;
  selected?: boolean;
}

interface ISidFieldState {
}

export class SidField extends React.PureComponent<ISidFieldProps, ISidFieldState> {
  render(): JSX.Element {
    return (
      <span className={classNames('sid-field-component', { 'selected': this.props.selected })}>
        {this.props.sid}
      </span>
    );
  }
}
