import { IIssueChange, IApplication } from '../../../application';
import { KeyCode } from '../../../framework/keyboard';
import { ServiceManager } from '../../../services';
import { UpdateIssueAction } from '../../../actions/issues';
import { IActionManager } from '../../../framework/actions';
import { IIssueController } from '../../../modules/issues/iissue-controller';
import { BaseCommand } from '../../../framework/commands';
import { IContextManager } from '../../../framework/context';
import { IssueType } from '../../../modules/issues/issue-type';

export class UpdateIssueCommand extends BaseCommand {
  private application = ServiceManager.Instance.getService<IApplication>('IApplication');
  private contextManager = ServiceManager.Instance.getService<IContextManager>('IContextManager');
  private actionManager = ServiceManager.Instance.getService<IActionManager>('IActionManager');

  constructor(private issueController: IIssueController) {
    super();
  }

  get id() {
    return 'update-issue';
  }

  get title() {
    return 'Update Issue';
  }

  get shortcut() {
    return [
      { keyCode: KeyCode.U },
      { keyCode: KeyCode.U },
    ];
  }

  get isEnabled() {
    const context = this.contextManager.getContext();

    return context['core.activeItemType'] === IssueType && !!this.issueController.getLastChange();
  }

  async execute() {
    const context = this.contextManager.getContext();
    const activeIssue = context['core.activeItem'];
    const issueChange = this.issueController.getLastChange();

    const newIssueChange: IIssueChange = {
      type: issueChange.type,
      state: issueChange.state,
      tags: issueChange.tags,
      project: issueChange.project,
      milestone: issueChange.milestone,
      assignedTo: issueChange.assignedTo,
    };

    await this.actionManager.execute(new UpdateIssueAction(activeIssue, newIssueChange, this.application));
  }
}
