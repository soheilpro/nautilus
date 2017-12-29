import * as React from 'react';
import * as classNames from 'classnames';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface ITextFieldProps {
  text: string;
  bold?: boolean;
}

interface ITextFieldState {
}

export default class TextField extends React.PureComponent<ITextFieldProps, ITextFieldState> {
  render(): JSX.Element {
    return (
      <span className={classNames('text-field-component', { 'bold': this.props.bold })}>
        {this.props.text}
      </span>
    );
  }
}
