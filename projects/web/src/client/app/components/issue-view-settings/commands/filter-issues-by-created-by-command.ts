import { BaseCommand } from '../../../framework/commands';
import { KeyCode, IShortcut } from '../../../framework/keyboard';

export class FilterIssuesByCreatedByCommand extends BaseCommand {
  constructor(private onExecute: () => void) {
    super();
  }

  get id(): string {
    return 'issue-created-by-filter';
  }

  get title(): string {
    return 'Filter by Created By';
  }

  get shortcut(): IShortcut {
    return [
      { keyCode: KeyCode.F },
      { keyCode: KeyCode.B },
      { keyCode: KeyCode.C },
    ];
  }

  execute(): void {
    this.onExecute();
  }
}
