import { BaseCommand } from '../../../framework/commands';
import { KeyCode } from '../../../framework/keyboard';

export class FilterIssuesByAssignedToCommand extends BaseCommand {
  constructor(private onExecute: () => void) {
    super();
  }

  get id() {
    return 'issue-assigned-to-filter';
  }

  get title() {
    return 'Filter by Assigned To';
  }

  get shortcut() {
    return [
      { keyCode: KeyCode.F },
      { keyCode: KeyCode.B },
      { keyCode: KeyCode.A },
    ];
  }

  execute() {
    this.onExecute();
  }
}
