import { BaseCommand } from '../../../framework/commands';
import { KeyCode, IShortcut } from '../../../framework/keyboard';

export class LoadViewCommand extends BaseCommand {
  constructor(private onExecute: () => void) {
    super();
  }

  get id(): string {
    return 'load-view';
  }

  get title(): string {
    return 'View: Load';
  }

  get shortcut(): IShortcut {
    return [
      { keyCode: KeyCode.V },
      { keyCode: KeyCode.L },
    ];
  }

  execute(): void {
    this.onExecute();
  }
}
