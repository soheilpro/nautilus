import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';

export default class FilterMilestonesByCreatedByCommand extends BaseCommand {
  constructor(private onExecute: () => void) {
    super();
  }

  get id() {
    return 'milestone-created-by-filter';
  }

  get title() {
    return 'Filter by Created By';
  }

  get shortcut() {
    return [
      { keyCode: KeyCode.F },
      { keyCode: KeyCode.B },
      { keyCode: KeyCode.C },
    ];
  }

  execute() {
    this.onExecute();
  }
}
