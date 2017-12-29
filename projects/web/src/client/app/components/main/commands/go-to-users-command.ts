import { History } from 'history';
import { BaseCommand } from '../../../framework/commands';
import { KeyCode, IShortcut } from '../../../framework/keyboard';

export class GoToUsersCommand extends BaseCommand {
  constructor(private history: History) {
    super();
  }

  get id(): string {
    return 'go-to-users';
  }

  get title(): string {
    return 'Go to Users';
  }

  get shortcut(): IShortcut {
    return [
      { keyCode: KeyCode.G },
      { keyCode: KeyCode.U }
    ];
  }

  execute(): void {
    this.history.push('/users');
  }
}
