import * as React from 'react';
import * as classNames from 'classnames';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface ISidFieldProps {
  sid: string;
  bold?: boolean;
}

interface ISidFieldState {
}

export class SidField extends React.PureComponent<ISidFieldProps, ISidFieldState> {
  render(): JSX.Element {
    return (
      <span className={classNames('sid-field-component', { 'bold': this.props.bold })}>
        {this.props.sid}
      </span>
    );
  }
}
