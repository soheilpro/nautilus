import { BaseCommand, ICommandController } from '../../../../framework/commands';
import { KeyCode, IShortcut } from '../../../../framework/keyboard';
import { ServiceManager } from '../../../../services';

export class ShowCommandPaletteCommand extends BaseCommand {
  private commandController = ServiceManager.Instance.getService<ICommandController>('ICommandController');

  get id(): string {
    return 'show-command-palette';
  }

  get title(): string {
    return 'Show Command Palette';
  }

  get shortcut(): IShortcut {
    return [{ keyCode: KeyCode.P }];
  }

  get isVisible(): boolean {
    return false;
  }

  execute(): void {
    this.commandController.showCommandPaletteWindow();
  }
}
