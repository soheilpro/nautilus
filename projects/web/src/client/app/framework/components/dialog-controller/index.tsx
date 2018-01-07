import * as React from 'react';
import { ServiceManager } from '../../../services';
import { IDialog, IDialogButton, IDialogController } from '../../dialog';
import { IWindowController } from '../../windows';
import { DialogWindow } from '../dialog-window';

interface IDialogControllerProps {
}

interface IDialogControllerState {
}

export class DialogController extends React.PureComponent<IDialogControllerProps, IDialogControllerState> implements IDialogController {
  private windowController = ServiceManager.Instance.getService<IWindowController>('IWindowController');

  componentWillMount(): void {
    ServiceManager.Instance.registerService('IDialogController', this);
  }

  componentWillUnmount(): void {
    ServiceManager.Instance.unregisterService('IDialogController', this);
  }

  showDialog(dialog: IDialog): void {
    const handleButtonClick = (button: IDialogButton) => {
      this.windowController.closeWindow(handle, () => {
        if (dialog.onButtonClick)
          dialog.onButtonClick(button);
      });
    };

    const window = <DialogWindow dialog={dialog} onButtonClick={handleButtonClick} />;
    const options = {
      top: 120,
      width: 600,
      modal: true,
    };

    const handle = this.windowController.showWindow(window, options);
  }

  showErrorDialog(options: { title: string, message: string }): void {
    const dialog: IDialog = {
      title: options.title,
      content: options.message,
      buttons: [
        { key: 'ok', title: 'OK', type: 'default' },
      ],
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
        if (button.key === 'ok')
          options.onConfirm();
      },
    };

    this.showDialog(dialog);
  }

  render(): JSX.Element {
    return (
      <div className="dialog-controller-component">
      </div>
    );
  }
}
