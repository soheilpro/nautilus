import { IIssue, IIssueChange } from '../../application';
import { IItemController } from '../../framework/items';

export interface IIssueController extends IItemController {
  createIssue(issue?: IIssue, parentIssue?: IIssue): void;
  duplicateIssue(issue: IIssue): void;
  createSubIssue(issue: IIssue): void;
  applyLastChangeToIssue(issue: IIssue): void;
  assignIssue(issue: IIssue): void;
  setIssueState(issue: IIssue): void;
  setIssueMilestone(issue: IIssue): void;
  getLastChange(): IIssueChange;
}
