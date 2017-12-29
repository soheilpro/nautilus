import * as React from 'react';
import * as classNames from 'classnames';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IInputProps {
  value: string;
  placeholder?: string;
  secret?: boolean;
  multiline?: boolean;
  autoFocus?: boolean;
  selectOnFocus?: boolean;
  style?: 'default' | 'simple';
  className?: string;
  onChange(value: string): void;
}

interface IInputState {
}

export default class Input extends React.PureComponent<IInputProps, IInputState> {
  static defaultProps = {
    value: '',
    style: 'default',
  };

  constructor() {
    super();

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputFocus = this.handleInputFocus.bind(this);
    this.handleTextAreaChange = this.handleTextAreaChange.bind(this);
    this.handleTextAreaFocus = this.handleTextAreaFocus.bind(this);
  }

  private handleInputFocus(event: React.FormEvent<HTMLInputElement>): void {
    if (this.props.selectOnFocus)
      (event.target as HTMLInputElement).select();
  }

  private handleInputChange(event: React.FormEvent<HTMLInputElement>): void {
    const value = (event.target as HTMLInputElement).value;

    this.props.onChange(value);
  }

  private handleTextAreaFocus(event: React.FormEvent<HTMLTextAreaElement>): void {
    if (this.props.selectOnFocus)
      (event.target as HTMLTextAreaElement).select();
  }

  private handleTextAreaChange(event: React.FormEvent<HTMLTextAreaElement>): void {
    const value = (event.target as HTMLTextAreaElement).value;

    this.props.onChange(value);
  }

  render(): JSX.Element {
    return (
      this.props.multiline ?
        <textarea className={classNames('input-component', this.props.style, this.props.className)} value={this.props.value} placeholder={this.props.placeholder} autoFocus={this.props.autoFocus} onFocus={this.handleTextAreaFocus} onChange={this.handleTextAreaChange} />
        :
        <input className={classNames('input-component', this.props.style, this.props.className)} type={this.props.secret ? 'password' : 'text'} value={this.props.value} placeholder={this.props.placeholder} autoFocus={this.props.autoFocus} onFocus={this.handleInputFocus} onChange={this.handleInputChange} />
    );
  }
}
