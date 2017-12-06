import { IShortcut } from '../../framework/keyboard';
import { ICommand } from './icommand';

export abstract class BaseCommand implements ICommand {
  abstract get id(): string;
  abstract get title(): string;

  get shortcut(): IShortcut {
    return null;
  }

  get isAvailable() {
    return true;
  }

  get isEnabled() {
    return true;
  }

  get isVisible() {
    return true;
  }

  abstract execute(): void;
}
