import * as React from 'react';
import { ServiceManager } from '../../../services';
import Button from '../button';
import { ICommandManager } from '../../commands';

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
  private commandManager = ServiceManager.Instance.getService<ICommandManager>('ICommandManager');

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
