import { BaseCommand } from '../../../framework/commands';
import { KeyCode, IShortcut } from '../../../framework/keyboard';

export class FilterIssuesByProjectCommand extends BaseCommand {
  constructor(private onExecute: () => void) {
    super();
  }

  get id(): string {
    return 'issue-project-filter';
  }

  get title(): string {
    return 'Filter by Project';
  }

  get shortcut(): IShortcut {
    return [
      { keyCode: KeyCode.F },
      { keyCode: KeyCode.B },
      { keyCode: KeyCode.P },
    ];
  }

  execute(): void {
    this.onExecute();
  }
}
