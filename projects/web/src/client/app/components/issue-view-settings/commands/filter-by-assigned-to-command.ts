import { BaseCommand } from '../../../framework/commands';
import { KeyCode, IShortcut } from '../../../framework/keyboard';

export class FilterByAssignedToCommand extends BaseCommand {
  constructor(private onExecute: () => void) {
    super();
  }

  get id(): string {
    return 'issue-assigned-to-filter';
  }

  get title(): string {
    return 'Filter by Assigned To';
  }

  get shortcut(): IShortcut {
    return [
      { keyCode: KeyCode.F },
      { keyCode: KeyCode.B },
      { keyCode: KeyCode.A },
    ];
  }

  execute(): void {
    this.onExecute();
  }
}
