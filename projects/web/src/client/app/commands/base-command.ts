import { IShortcut } from '../keyboard';
import { ICommand } from './icommand';

export abstract class BaseCommand implements ICommand {
  abstract get id(): string;
  abstract get title(): string;

  get shortcut(): IShortcut {
    return null;
  }

  get visible() {
    return true;
  }

  get enabled() {
    return true;
  }

  abstract execute(): void;
}
