import { BaseCommand, ICommandController } from '../../../../framework/commands';
import { KeyCode } from '../../../../framework/keyboard';
import { ServiceManager } from '../../../../services';

export class ShowCommandPaletteCommand extends BaseCommand {
  private commandController = ServiceManager.Instance.getService<ICommandController>('ICommandController');

  get id() {
    return 'show-command-palette';
  }

  get title() {
    return 'Show Command Palette';
  }

  get shortcut() {
    return [{ keyCode: KeyCode.P }];
  }

  get isVisible() {
    return false;
  }

  execute() {
    this.commandController.showCommandPaletteWindow();
  }
}
