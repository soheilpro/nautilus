import { IIssue } from '../../../application';
import { KeyCode } from '../../../framework/keyboard';
import { ServiceManager } from '../../../services';
import { IIssueController, IssueType } from '../../../modules/issues';
import { IContextManager } from '../../../framework/context';
import { BaseCommand } from '../../../framework/commands';

export class DuplicateIssueCommand extends BaseCommand {
  private contextManager = ServiceManager.Instance.getService<IContextManager>('IContextManager');
  private issueController = ServiceManager.Instance.getService<IIssueController>('IIssueController');

  constructor() {
    super();
  }

  get id() {
    return 'duplicate-issue';
  }

  get title() {
    return 'Duplicate Issue';
  }

  get shortcut() {
    return [{ keyCode: KeyCode.N, shiftKey: true }];
  }

  get isEnabled() {
    const context = this.contextManager.getContext();

    return context['core.activeItemType'] === IssueType;
  }

  execute() {
    const context = this.contextManager.getContext();
    const activeIssue = context['core.activeItem'];

    const newIssue: IIssue = {
      title: activeIssue.title,
      description: activeIssue.description,
      type: activeIssue.type,
      state: activeIssue.state,
      project: activeIssue.project,
      assignedTo: activeIssue.assignedTo,
      milestone: activeIssue.milestone,
    };

    this.issueController.createNew(newIssue, activeIssue.parent);
  }
}
