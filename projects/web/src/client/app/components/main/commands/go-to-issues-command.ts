import { History } from 'history';
import { BaseCommand } from '../../../framework/commands';
import { KeyCode, IShortcut } from '../../../framework/keyboard';

export class GoToIssuesCommand extends BaseCommand {
  constructor(private history: History) {
    super();
  }

  get id(): string {
    return 'go-to-issues';
  }

  get title(): string {
    return 'Go to Issues';
  }

  get shortcut(): IShortcut {
    return [
      { keyCode: KeyCode.G },
      { keyCode: KeyCode.I },
    ];
  }

  execute(): void {
    this.history.push('/');
  }
}
