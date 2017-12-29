import * as React from 'react';
import * as classNames from 'classnames';
import { ButtonType } from './button-type';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IButtonProps {
  type?: ButtonType;
  enabled?: boolean;
  autoFocus?: boolean;
  form?: string;
  className?: string;
  onClick?(): void;
}

interface IButtonState {
}

export default class Button extends React.PureComponent<IButtonProps, IButtonState> {
  static defaultProps = {
    type: 'primary',
    enabled: true,
  };

  constructor() {
    super();

    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  private handleButtonClick(): void {
    if (this.props.onClick)
      this.props.onClick();
  }

  render(): JSX.Element {
    return (
      <button className={classNames('button-component', this.props.type, this.props.className)} disabled={!this.props.enabled} autoFocus={this.props.autoFocus} form={this.props.form} onClick={this.handleButtonClick}>
        {this.props.children}
      </button>
    );
  }
}

export * from './button-type';
