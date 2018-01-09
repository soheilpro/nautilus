import { KeyCode, IShortcut } from '../../../framework/keyboard';
import { IIssueController, IssueType } from '../../../modules/issues';
import { IContextManager } from '../../../framework/context';
import { BaseCommand } from '../../../framework/commands';

export class DuplicateIssueCommand extends BaseCommand {
  constructor(private issueController: IIssueController, private contextManager: IContextManager) {
    super();
  }

  get id(): string {
    return 'duplicate-issue';
  }

  get title(): string {
    return 'Duplicate Issue';
  }

  get shortcut(): IShortcut {
    return [{ keyCode: KeyCode.N, shiftKey: true }];
  }

  get isEnabled(): boolean {
    const context = this.contextManager.getContext();

    return context['core.activeItemType'] === IssueType;
  }

  execute(): void {
    const context = this.contextManager.getContext();
    const activeIssue = context['core.activeItem'];

    this.issueController.duplicateIssue(activeIssue);
  }
}
