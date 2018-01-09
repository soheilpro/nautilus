import { KeyCode, IShortcut } from '../../../framework/keyboard';
import { IIssueController } from '../../../modules/issues/iissue-controller';
import { BaseCommand } from '../../../framework/commands';
import { IContextManager } from '../../../framework/context';
import { IssueType } from '../../../modules/issues/issue-type';

export class RepeatUpdateIssueCommand extends BaseCommand {
  constructor(private issueController: IIssueController, private contextManager: IContextManager) {
    super();
  }

  get id(): string {
    return 'repeat-update-issue';
  }

  get title(): string {
    return 'Repeat Update Issue';
  }

  get shortcut(): IShortcut {
    return [
      { keyCode: KeyCode.U },
      { keyCode: KeyCode.U },
    ];
  }

  get isEnabled(): boolean {
    const context = this.contextManager.getContext();

    return context['core.activeItemType'] === IssueType && !!this.issueController.getLastChange();
  }

  execute(): void {
    const context = this.contextManager.getContext();
    const activeIssue = context['core.activeItem'];

    this.issueController.applyLastChangeToIssue(activeIssue);
  }
}
