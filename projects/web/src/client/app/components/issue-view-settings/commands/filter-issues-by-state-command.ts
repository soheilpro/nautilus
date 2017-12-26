import { BaseCommand } from '../../../framework/commands';
import { KeyCode, IShortcut } from '../../../framework/keyboard';

export class FilterIssuesByStateCommand extends BaseCommand {
  constructor(private onExecute: () => void) {
    super();
  }

  get id(): string {
    return 'issue-state-filter';
  }

  get title(): string {
    return 'Filter by State';
  }

  get shortcut(): IShortcut {
    return [
      { keyCode: KeyCode.F },
      { keyCode: KeyCode.B },
      { keyCode: KeyCode.S },
    ];
  }

  execute(): void {
    this.onExecute();
  }
}
