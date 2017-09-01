import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';

export default class FiltersMilestoneByProjectCommand extends BaseCommand {
  constructor(private onExecute: () => void) {
    super();
  }

  get id() {
    return 'milestone-project-filter';
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
