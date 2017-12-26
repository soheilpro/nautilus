import { IShortcut } from '../../framework/keyboard';
import { ICommand } from './icommand';

export abstract class BaseCommand implements ICommand {
  abstract get id(): string;
  abstract get title(): string;

  get shortcut(): IShortcut {
    return null;
  }

  get isAvailable(): boolean {
    return true;
  }

  get isEnabled(): boolean {
    return true;
  }

  get isVisible(): boolean {
    return true;
  }

  abstract execute(): void;
}
