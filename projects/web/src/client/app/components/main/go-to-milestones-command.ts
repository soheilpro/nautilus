import { History } from 'history';
import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';

export default class GoToMilestonesCommand extends BaseCommand {
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
