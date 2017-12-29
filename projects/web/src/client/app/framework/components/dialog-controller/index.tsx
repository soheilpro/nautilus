import * as _ from 'underscore';
import * as React from 'react';
import { ServiceManager } from '../../../services';
import { IDialog, IDialogButton, IDialogController } from '../../dialog';
import { IWindow, IWindowController } from '../../windows';
import DialogWindow from '../dialog-window';

interface IDialogControllerProps {
}

interface IDialogControllerState {
}

export default class DialogController extends React.PureComponent<IDialogControllerProps, IDialogControllerState> implements IDialogController {
  private windowController = ServiceManager.Instance.getService<IWindowController>('IWindowController');
  private dialogWindow: IWindow;

  constructor() {
    super();

    this.handleDialogWindowButtonClick = this.handleDialogWindowButtonClick.bind(this);
  }

  componentWillMount(): void {
    ServiceManager.Instance.registerService('IDialogController', this);
  }

  componentWillUnmount(): void {
    ServiceManager.Instance.unregisterService('IDialogController', this);
  }

  showDialog(dialog: IDialog): void {
    this.dialogWindow = {
      content: <DialogWindow dialog={dialog} onButtonClick={_.partial(this.handleDialogWindowButtonClick, dialog)} />,
      top: 120,
      width: 600,
      modal: true,
    };

    this.windowController.showWindow(this.dialogWindow);
  }

  showErrorDialog(options: { title: string, message: string }): void {
    const dialog: IDialog = {
      title: options.title,
      content: options.message,
      buttons: [
        { key: 'ok', title: 'OK', type: 'default' },
      ],
      onButtonClick: (button: IDialogButton): void => {
        this.windowController.closeWindow(this.dialogWindow);
      },
    };

    this.showDialog(dialog);
  }

  showConfirmDialog(options: { title: string, message: string, buttonTitle: string, destructive: boolean, onConfirm: () => void }): void {
    const dialog: IDialog = {
      title: options.title,
      content: options.message,
      buttons: [
        { key: 'ok', title: options.buttonTitle || 'OK', type: options.destructive ? 'destructive' : 'default' },
        { key: 'cancel', title: 'Cancel', type: 'cancel' },
      ],
      onButtonClick: (button: IDialogButton): void => {
        this.windowController.closeWindow(this.dialogWindow, () => {
          if (button.key === 'ok')
            options.onConfirm();
        });
      },
    };

    this.showDialog(dialog);
  }

  private handleDialogWindowButtonClick(dialog: IDialog, button: IDialogButton): void {
    dialog.onButtonClick(button);
  }

  render(): JSX.Element {
    return (
      <div className="dialog-controller-component">
      </div>
    );
  }
}
