import { History } from 'history';
import { BaseCommand } from '../../../framework/commands';
import { KeyCode, IShortcut } from '../../../framework/keyboard';

export class GoToMilestonesCommand extends BaseCommand {
  constructor(private history: History) {
    super();
  }

  get id(): string {
    return 'go-to-milestones';
  }

  get title(): string {
    return 'Go to Milestones';
  }

  get shortcut(): IShortcut {
    return [
      { keyCode: KeyCode.G },
      { keyCode: KeyCode.M },
    ];
  }

  execute(): void {
    this.history.push('/milestones');
  }
}
