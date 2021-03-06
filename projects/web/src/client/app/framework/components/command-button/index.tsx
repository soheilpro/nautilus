import * as React from 'react';
import { ServiceManager } from '../../../services';
import { Button } from '../button';
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

export class CommandButton extends React.PureComponent<ICommandButtonProps, ICommandButtonState> {
  private commandManager = ServiceManager.Instance.getService<ICommandManager>('ICommandManager');

  constructor() {
    super();

    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  private handleButtonClick(): void {
    this.commandManager.executeCommand(this.props.commandId);
  }

  render(): JSX.Element {
    return (
      <Button onClick={this.handleButtonClick} {...this.props}>
        {this.props.children}
      </Button>
    );
  }
}
