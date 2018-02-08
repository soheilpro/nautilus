import { BaseCommand } from '../../../framework/commands';
import { KeyCode, IShortcut } from '../../../framework/keyboard';
import { IIssueController } from '../../../modules/issues/iissue-controller';

export class FindIssueCommand extends BaseCommand {
  constructor(private issueController: IIssueController) {
    super();
  }

  get id(): string {
    return 'find-issue';
  }

  get title(): string {
    return 'Find issue';
  }

  get shortcut(): IShortcut {
    return [
      { keyCode: KeyCode.F },
      { keyCode: KeyCode.I },
    ];
  }

  execute(): void {
    this.issueController.findIssue();
  }
}
