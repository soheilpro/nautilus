import { IShortcut } from '../../framework/keyboard';

export interface ICommand {
  id: string;
  title: string;
  shortcut: IShortcut;
  isAvailable: boolean;
  isEnabled: boolean;
  isVisible: boolean;
  execute(): void;
}
