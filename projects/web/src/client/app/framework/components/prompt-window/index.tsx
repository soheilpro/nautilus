import * as React from 'react';
import { Window, WindowHeader, WindowContent, WindowActionBar } from '../window';
import { Button } from '../button';
import { Input } from '../input';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IPromptWindowProps {
  title: string;
  message?: string;
  placeholder?: string;
  confirmButtonText: string;
  onConfirm(value: string): void;
  onClose(): void;
}

interface IPromptWindowState {
  inputText?: string;
}

export class PromptWindow extends React.PureComponent<IPromptWindowProps, IPromptWindowState> {
  constructor() {
    super();

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.state = {};
  }

  private handleFormSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    this.props.onConfirm(this.state.inputText);
  }

  private handleInputChange(value: string): void {
    this.setState({
      inputText: value,
    });
  }

  render(): JSX.Element {
    return (
      <Window className="promp-window-component">
        <WindowHeader>{this.props.title}</WindowHeader>
        <WindowContent>
          <form className="form" id="promptForm" onSubmit={this.handleFormSubmit}>
            {
              this.props.message &&
                <div className="message">
                  {this.props.message}
                </div>
            }
            <Input className="input" placeholder={this.props.placeholder} value={this.state.inputText} autoFocus={true} selectOnFocus={true} onChange={this.handleInputChange} />
          </form>
        </WindowContent>
        <WindowActionBar>
          <Button type="submit" form="promptForm">{this.props.confirmButtonText}</Button>
          <Button type="secondary" onClick={this.props.onClose}>Cancel</Button>
        </WindowActionBar>
      </Window>
    );
  }
}
