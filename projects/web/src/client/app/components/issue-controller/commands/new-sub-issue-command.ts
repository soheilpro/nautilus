import { KeyCode, IShortcut } from '../../../framework/keyboard';
import { IIssueController, IssueType } from '../../../modules/issues';
import { BaseCommand } from '../../../framework/commands';
import { IContextManager } from '../../../framework/context';

export class NewSubIssueCommand extends BaseCommand {
  constructor(private issueController: IIssueController, private contextManager: IContextManager) {
    super();
  }

  get id(): string {
    return 'new-sub-issue';
  }

  get title(): string {
    return 'New Sub-Issue';
  }

  get shortcut(): IShortcut {
    return [{ keyCode: KeyCode.B }];
  }

  get isEnabled(): boolean {
    const context = this.contextManager.getContext();

    return context['core.activeItemType'] === IssueType;
  }

  execute(): void {
    const context = this.contextManager.getContext();
    const activeIssue = context['core.activeItem'];

    this.issueController.createSubIssue(activeIssue);
  }
}
