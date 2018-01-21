import { KeyCode, IShortcut } from '../../../framework/keyboard';
import { IIssueController, IssueType } from '../../../modules/issues';
import { IContextManager } from '../../../framework/context';
import { BaseCommand } from '../../../framework/commands';

export class SetIssueMilestoneCommand extends BaseCommand {
  constructor(private issueController: IIssueController, private contextManager: IContextManager) {
    super();
  }

  get id(): string {
    return 'set-issue-milestone';
  }

  get title(): string {
    return 'Set Issue Milestone';
  }

  get shortcut(): IShortcut {
    return [{ keyCode: KeyCode.M }];
  }

  get isEnabled(): boolean {
    const context = this.contextManager.getContext();

    return context['core.activeItemType'] === IssueType;
  }

  execute(): void {
    const context = this.contextManager.getContext();
    const activeIssue = context['core.activeItem'];

    this.issueController.setIssueMilestone(activeIssue);
  }
}
