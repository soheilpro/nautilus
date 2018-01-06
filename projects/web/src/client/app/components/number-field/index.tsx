import * as React from 'react';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface INumberFieldProps {
  number: number;
}

interface INumberFieldState {
}

export class NumberField extends React.PureComponent<INumberFieldProps, INumberFieldState> {
  render(): JSX.Element {
    return (
      <span className={'number-field-component'}>
        {this.props.number}
      </span>
    );
  }
}
