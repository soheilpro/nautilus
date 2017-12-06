import * as _ from 'underscore';
import { IIssue, IApplication } from '../../../application';
import { KeyCode } from '../../../framework/keyboard';
import { ServiceManager } from '../../../services';
import { IIssueController, IssueType } from '../../../modules/issues';
import { BaseCommand } from '../../../framework/commands';
import { IContextManager } from '../../../framework/context';

export class NewSubIssueCommand extends BaseCommand {
  private application = ServiceManager.Instance.getService<IApplication>('IApplication');
  private contextManager = ServiceManager.Instance.getService<IContextManager>('IContextManager');
  private issueController = ServiceManager.Instance.getService<IIssueController>('IIssueController');

  constructor() {
    super();
  }

  get id() {
    return 'new-sub-issue';
  }

  get title() {
    return 'New Sub-Issue';
  }

  get shortcut() {
    return [{ keyCode: KeyCode.S }];
  }

  get isEnabled() {
    const context = this.contextManager.getContext();

    return context['core.activeItemType'] === IssueType;
  }

  execute() {
    const context = this.contextManager.getContext();
    const activeIssue = context['core.activeItem'];

    const issue: IIssue = {
      type: _.find(this.application.itemTypes.getAll('issue'), itemType => itemType.key === 'task'),
      state: _.find(this.application.itemStates.getAll('issue'), itemType => itemType.key === 'todo'),
      project: activeIssue.project,
      assignedTo: activeIssue.assignedTo,
      milestone: activeIssue.milestone,
    };

    this.issueController.createNew(issue, activeIssue);
  }
}
