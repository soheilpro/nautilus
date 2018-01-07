import { IDialogButton } from './idialog-button';

export interface IDialog {
  title: string;
  content: any;
  buttons: IDialogButton[];
  onButtonClick?(button: IDialogButton): void;
}
