import { BaseCommand } from '../../../framework/commands';
import { KeyCode } from '../../../framework/keyboard';

export class FilterIssuesByProjectCommand extends BaseCommand {
  constructor(private onExecute: () => void) {
    super();
  }

  get id() {
    return 'issue-project-filter';
  }

  get title() {
    return 'Filter by Project';
  }

  get shortcut() {
    return [
      { keyCode: KeyCode.F },
      { keyCode: KeyCode.B },
      { keyCode: KeyCode.P },
    ];
  }

  execute() {
    this.onExecute();
  }
}
