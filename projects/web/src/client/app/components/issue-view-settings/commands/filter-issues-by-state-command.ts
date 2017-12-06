import { BaseCommand } from '../../../framework/commands';
import { KeyCode } from '../../../framework/keyboard';

export class FilterIssuesByStateCommand extends BaseCommand {
  constructor(private onExecute: () => void) {
    super();
  }

  get id() {
    return 'issue-state-filter';
  }

  get title() {
    return 'Filter by State';
  }

  get shortcut() {
    return [
      { keyCode: KeyCode.F },
      { keyCode: KeyCode.B },
      { keyCode: KeyCode.S },
    ];
  }

  execute() {
    this.onExecute();
  }
}
