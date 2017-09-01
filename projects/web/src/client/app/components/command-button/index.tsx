import * as React from 'react';
import { ServiceManager } from '../../services';
import Button from '../button';

interface ICommandButtonProps {
  commandId: string;
  type?: 'primary' | 'secondary' | 'submit' | 'destructive';
  enabled?: boolean;
  autoFocus?: boolean;
  form?: string;
  className?: string;
}

interface ICommandButtonState {
}

export default class CommandButton extends React.PureComponent<ICommandButtonProps, ICommandButtonState> {
  private commandManager = ServiceManager.Instance.getCommandManager();

  constructor() {
    super();

    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  private handleButtonClick() {
    this.commandManager.executeCommand(this.props.commandId);
  }

  render() {
    return (
      <Button onClick={this.handleButtonClick} {...this.props}>
        {this.props.children}
      </Button>
    );
  }
};
