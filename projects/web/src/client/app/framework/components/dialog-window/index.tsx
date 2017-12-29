import * as _ from 'underscore';
import * as React from 'react';
import { IDialog, IDialogButton } from '../../dialog';
import { Window, WindowHeader, WindowContent, WindowActionBar } from '../window';
import { Button, ButtonType } from '../button';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IDialogWindowProps {
  dialog: IDialog;
  onButtonClick(button: IDialogButton): void;
}

interface IDialogWindowState {
}

export class DialogWindow extends React.PureComponent<IDialogWindowProps, IDialogWindowState> {
  private getButtonType(button: IDialogButton): ButtonType {
    if (button.type === 'default')
      return 'primary';

    if (button.type === 'cancel')
      return 'secondary';

    if (button.type === 'destructive')
      return 'destructive';

    throw new Error('Not supported.');
  }

  render(): JSX.Element {
    return (
      <Window className="dialog-window-component">
        <WindowHeader>{this.props.dialog.title}</WindowHeader>
        <WindowContent>
          <div className="content">
            {this.props.dialog.content}
          </div>
        </WindowContent>
        <WindowActionBar>
          {
            this.props.dialog.buttons.map((button, index) => {
              return (
                <Button type={this.getButtonType(button)} autoFocus={index === 0} onClick={_.partial(this.props.onButtonClick, button)} key={button.key}>{button.title}</Button>
              );
            })
          }
        </WindowActionBar>
      </Window>
    );
  }
}
