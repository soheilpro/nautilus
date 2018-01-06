import * as React from 'react';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface ITextFieldProps {
  text: string;
}

interface ITextFieldState {
}

export class TextField extends React.PureComponent<ITextFieldProps, ITextFieldState> {
  render(): JSX.Element {
    return (
      <span className={'text-field-component'}>
        {this.props.text}
      </span>
    );
  }
}
