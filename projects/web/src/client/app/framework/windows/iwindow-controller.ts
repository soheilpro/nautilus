import { IWindow } from './iwindow';

export interface IWindowController {
  showWindow(window: IWindow, callback?: () => any): void;
  closeWindow(window: IWindow, callback?: () => any): void;
}
