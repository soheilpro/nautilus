import { IWindowOptions } from './iwindow-options';
import { IWindowHandle } from './iwindow-handle';

export interface IWindowController {
  showWindow(window: JSX.Element, options: IWindowOptions, callback?: () => any): IWindowHandle;
  closeWindow(handle: IWindowHandle, callback?: () => any): void;
}
