import { History } from 'history';
import { BaseCommand } from '../../../framework/commands';
import { KeyCode } from '../../../framework/keyboard';

export class GoToMilestonesCommand extends BaseCommand {
  constructor(private history: History) {
    super();
  }

  get id() {
    return 'go-to-milestones';
  }

  get title() {
    return 'Go to Milestones';
  }

  get shortcut() {
    return [
      { keyCode: KeyCode.G },
      { keyCode: KeyCode.M }
    ];
  }

  execute() {
    this.history.push('/milestones');
  }
}
