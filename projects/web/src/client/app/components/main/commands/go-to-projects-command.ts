import { History } from 'history';
import { BaseCommand } from '../../../framework/commands';
import { KeyCode, IShortcut } from '../../../framework/keyboard';

export class GoToProjectsCommand extends BaseCommand {
  constructor(private history: History) {
    super();
  }

  get id(): string {
    return 'go-to-projects';
  }

  get title(): string {
    return 'Go to Projects';
  }

  get shortcut(): IShortcut {
    return [
      { keyCode: KeyCode.G },
      { keyCode: KeyCode.P },
    ];
  }

  execute(): void {
    this.history.push('/projects');
  }
}
