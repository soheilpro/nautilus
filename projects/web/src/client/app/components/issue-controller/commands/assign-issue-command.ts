import { KeyCode, IShortcut } from '../../../framework/keyboard';
import { ServiceManager } from '../../../services';
import { IIssueController, IssueType } from '../../../modules/issues';
import { IContextManager } from '../../../framework/context';
import { BaseCommand } from '../../../framework/commands';

export class AssignIssueCommand extends BaseCommand {
  private contextManager = ServiceManager.Instance.getService<IContextManager>('IContextManager');
  private issueController = ServiceManager.Instance.getService<IIssueController>('IIssueController');

  constructor() {
    super();
  }

  get id(): string {
    return 'assign-issue';
  }

  get title(): string {
    return 'Assign Issue';
  }

  get shortcut(): IShortcut {
    return [{ keyCode: KeyCode.A }];
  }

  get isEnabled(): boolean {
    const context = this.contextManager.getContext();

    return context['core.activeItemType'] === IssueType;
  }

  execute(): void {
    const context = this.contextManager.getContext();
    const activeIssue = context['core.activeItem'];

    this.issueController.assignIssue(activeIssue);
  }
}
