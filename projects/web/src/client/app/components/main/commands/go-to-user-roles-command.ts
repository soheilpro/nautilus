import { History } from 'history';
import { BaseCommand } from '../../../framework/commands';
import { KeyCode, IShortcut } from '../../../framework/keyboard';

export class GoToUserRolesCommand extends BaseCommand {
  constructor(private history: History) {
    super();
  }

  get id(): string {
    return 'go-to-user-roles';
  }

  get title(): string {
    return 'Go to User Roles';
  }

  get shortcut(): IShortcut {
    return [
      { keyCode: KeyCode.G },
      { keyCode: KeyCode.R },
    ];
  }

  execute(): void {
    this.history.push('/user-roles');
  }
}
