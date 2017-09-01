import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';

export default class LoadViewCommand extends BaseCommand {
  constructor(private onExecute: () => void) {
    super();
  }

  get id() {
    return 'load-view';
  }

  get title() {
    return 'View: Load';
  }

  get shortcut() {
    return [
      { keyCode: KeyCode.V },
      { keyCode: KeyCode.L },
    ];
  }

  execute() {
    this.onExecute();
  }
}
