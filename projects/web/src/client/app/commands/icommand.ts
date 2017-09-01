import { IShortcut } from '../keyboard';

export interface ICommand {
  id: string;
  title: string;
  shortcut: IShortcut;
  visible: boolean;
  enabled: boolean;
  execute(): void;
}
