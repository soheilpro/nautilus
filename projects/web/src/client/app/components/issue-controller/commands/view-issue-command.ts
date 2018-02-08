import { KeyCode, IShortcut } from '../../../framework/keyboard';
import { IIssueController, IssueType } from '../../../modules/issues';
import { IContextManager } from '../../../framework/context';
import { BaseCommand } from '../../../framework/commands';

export class ViewIssueCommand extends BaseCommand {
  constructor(private issueController: IIssueController, private contextManager: IContextManager) {
    super();
  }

  get id(): string {
    return 'view-issue';
  }

  get title(): string {
    return 'View Issue';
  }

  get shortcut(): IShortcut {
    return [{ keyCode: KeyCode.O }];
  }

  get isEnabled(): boolean {
    const context = this.contextManager.getContext();

    return context['core.activeItemType'] === IssueType;
  }

  execute(): void {
    const context = this.contextManager.getContext();
    const activeIssue = context['core.activeItem'];

    this.issueController.viewIssue(activeIssue);
  }
}
