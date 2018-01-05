import { BaseCommand } from '../../../framework/commands';
import { KeyCode, IShortcut } from '../../../framework/keyboard';

export class FilterByUserCommand extends BaseCommand {
  constructor(private onExecute: () => void) {
    super();
  }

  get id(): string {
    return 'user-role-user-filter';
  }

  get title(): string {
    return 'Filter by User';
  }

  get shortcut(): IShortcut {
    return [
      { keyCode: KeyCode.F },
      { keyCode: KeyCode.B },
      { keyCode: KeyCode.U },
    ];
  }

  execute(): void {
    this.onExecute();
  }
}
