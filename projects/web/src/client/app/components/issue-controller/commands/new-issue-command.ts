import { BaseCommand } from '../../../framework/commands';
import { KeyCode, IShortcut } from '../../../framework/keyboard';
import { IIssueController } from '../../../modules/issues';

export class NewIssueCommand extends BaseCommand {
  constructor(private issueController: IIssueController) {
    super();
  }

  get id(): string {
    return 'new-issue';
  }

  get title(): string {
    return 'New Issue';
  }

  get shortcut(): IShortcut {
    return [{ keyCode: KeyCode.N }];
  }

  execute(): void {
    this.issueController.createIssue();
  }
}
