import * as React from 'react';
import * as classNames from 'classnames';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface INumberFieldProps {
  number: number;
  bold?: boolean;
}

interface INumberFieldState {
}

export default class NumberField extends React.PureComponent<INumberFieldProps, INumberFieldState> {
  render(): JSX.Element {
    return (
      <span className={classNames('number-field-component', { 'bold': this.props.bold })}>
        {this.props.number}
      </span>
    );
  }
};
