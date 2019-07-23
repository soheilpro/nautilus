import { IIssueController, IssueType } from '../../../modules/issues';
import { IContextManager } from '../../../framework/context';
import { BaseCommand } from '../../../framework/commands';
import { IShortcut, KeyCode } from '../../../framework/keyboard';

export class SetIssuePriorityCommand extends BaseCommand {
  constructor(private issueController: IIssueController, private contextManager: IContextManager) {
    super();
  }

  get id(): string {
    return 'set-issue-priority';
  }

  get title(): string {
    return 'Set Issue Priority';
  }

  get shortcut(): IShortcut {
    return [{ keyCode: KeyCode.Q }];
  }

  get isEnabled(): boolean {
    const context = this.contextManager.getContext();

    return context['core.activeItemType'] === IssueType;
  }

  execute(): void {
    const context = this.contextManager.getContext();
    const activeIssue = context['core.activeItem'];

    this.issueController.setIssuePriority(activeIssue);
  }
}
