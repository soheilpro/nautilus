import * as React from 'react';
import * as classNames from 'classnames';
import { IIssue } from '../../application';
import { ServiceManager } from '../../services';
import Table from '../../framework/components/table';
import TableHeader from './table-header';
import TableRow from './table-row';
import TableFooter from './table-footer';
import { IIssueController } from '../../modules/issues';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IIssueTableProps {
  issues?: IIssue[];
  selectedIssue?: IIssue;
  className?: string;
  onIssueSelect?(issue: IIssue): void;
}

interface IIssueTableState {
  issues?: IIssue[];
  selectedIssue?: IIssue;
}

export default class IssueTable extends React.PureComponent<IIssueTableProps, IIssueTableState> {
  private issueController = ServiceManager.Instance.getService<IIssueController>('IIssueController');

  constructor(props: IIssueTableProps) {
    super(props);

    this.handleTableItemSelect = this.handleTableItemSelect.bind(this);
    this.handleTableItemAction = this.handleTableItemAction.bind(this);
    this.handleTableItemDelete = this.handleTableItemDelete.bind(this);

    this.state = {
      issues: this.sortTreeList(props.issues),
      selectedIssue: props.selectedIssue,
    };
  }

  componentWillReceiveProps(props: IIssueTableProps): void {
    if (this.props.issues !== props.issues) {
      this.setState({
        issues: this.sortTreeList(props.issues),
      });
    }

    if (this.props.selectedIssue !== props.selectedIssue) {
      this.setState({
        selectedIssue: props.selectedIssue,
      });
    }
  }

  private handleTableItemSelect(issue: IIssue): void {
    if (this.props.onIssueSelect)
      this.props.onIssueSelect(issue);

    this.setState({
      selectedIssue: issue,
    });
  }

  private handleTableItemAction(issue: IIssue): void {
    return this.issueController.editItem(issue);
  }

  private handleTableItemDelete(issue: IIssue): void {
    return this.issueController.deleteItem(issue);
  }

  // This method reorders items in a sorted list so that child items appear
  // beneath their parents (while still retaining their original order)
  private sortTreeList(issues: IIssue[]): IIssue[] {
    issues = [...issues];

    const children: { [key: string]: IIssue[] } = {};

    // First, turn the list into a tree
    const subIssues = issues.filter(issue => !!issue.parent);

    for (const subIssue of subIssues) {
      const parent = subIssue.parent;
      children[parent.id] = [...(children[parent.id] || []), subIssue];

      const subIssueIndex = issues.indexOf(subIssue);
      issues.splice(subIssueIndex, 1);
    }

    // Then, turn the tree back into a flat list
    function flatten(issues: IIssue[]): IIssue[] {
      let result: IIssue[] = [];

      for (const issue of issues) {
        result = [
          ...result,
          issue,
          ...flatten(children[issue.id] || []),
        ];
      }

      return result;
    }

    return flatten(issues);
  }

  render(): JSX.Element {
    return (
      <Table className={classNames('issue-table-component', this.props.className)} items={this.state.issues} selectedItem={this.state.selectedIssue} Header={TableHeader} Row={TableRow} Footer={TableFooter} onItemSelect={this.handleTableItemSelect} onItemAction={this.handleTableItemAction} onItemDelete={this.handleTableItemDelete} />
    );
  }
}
