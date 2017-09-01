import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';
import { ServiceManager } from '../../services';

export default class ShowCommandPaletteCommand extends BaseCommand {
  private commandController = ServiceManager.Instance.getCommandController();

  get id() {
    return 'show-command-palette';
  }

  get title() {
    return 'Show Command Palette';
  }

  get shortcut() {
    return [{ keyCode: KeyCode.P }];
  }

  get visible() {
    return false;
  }

  execute() {
    this.commandController.showCommandPaletteWindow();
  }
}
