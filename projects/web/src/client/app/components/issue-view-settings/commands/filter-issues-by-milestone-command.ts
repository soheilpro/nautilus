import { BaseCommand } from '../../../framework/commands';
import { KeyCode } from '../../../framework/keyboard';

export class FilterIssuesByMilestoneCommand extends BaseCommand {
  constructor(private onExecute: () => void) {
    super();
  }

  get id() {
    return 'issue-milestone-filter';
  }

  get title() {
    return 'Filter by Milestone';
  }

  get shortcut() {
    return [
      { keyCode: KeyCode.F },
      { keyCode: KeyCode.B },
      { keyCode: KeyCode.M },
    ];
  }

  execute() {
    this.onExecute();
  }
}
