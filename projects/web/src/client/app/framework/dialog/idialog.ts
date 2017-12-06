export interface IDialogButton {
  key: string;
  title: string;
  type: 'default' | 'cancel' | 'destructive';
}

export interface IDialog {
  title: string;
  content: any;
  buttons: IDialogButton[];
  onButtonClick(button: IDialogButton): void;
}
