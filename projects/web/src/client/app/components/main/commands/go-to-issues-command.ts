import { History } from 'history';
import { BaseCommand } from '../../../framework/commands';
import { KeyCode } from '../../../framework/keyboard';

export class GoToIssuesCommand extends BaseCommand {
  constructor(private history: History) {
    super();
  }

  get id() {
    return 'go-to-issues';
  }

  get title() {
    return 'Go to Issues';
  }

  get shortcut() {
    return [
      { keyCode: KeyCode.G },
      { keyCode: KeyCode.I }
    ];
  }

  execute() {
    this.history.push('/');
  }
}
