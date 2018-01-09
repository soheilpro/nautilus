import { IIssue, IIssueChange } from '../../application';
import { IItemController } from '../../framework/items';

export interface IIssueController extends IItemController {
  createNew(issue: IIssue, parentIssue?: IIssue): void;
  assignIssue(issue: IIssue): void;
  getLastChange(): IIssueChange;
}
