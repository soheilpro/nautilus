import * as React from 'react';
import * as classNames from 'classnames';
import { IIssue } from '../../application';
import { ITableRow } from '../../framework/components/table';
import { ItemPriorityIndicator } from '../item-priority-indicator';
import { ItemStateField } from '../item-state-field';
import { ItemTypeField } from '../item-type-field';
import { MilestoneField } from '../milestone-field';
import { ProjectField } from '../project-field';
import { SidField } from '../sid-field';
import { TitleField } from '../title-field';
import { UserField } from '../user-field';

require('../../assets/stylesheets/base.less');
require('./table-row.less');

interface ITableRowProps {
  item: IIssue;
  index: number;
  isSelected: boolean;
  onSelect?(item: IIssue): void;
  onAction?(item: IIssue): void;
}

interface ITableRowState {
}

export class TableRow extends React.PureComponent<ITableRowProps, ITableRowState> implements ITableRow {
  private static stateToStatus: { [key: string]: string } = {
    'todo': 'pending',
    'doing': 'inprogress',
    'done': 'finished',
    'closed': 'closed',
  };

  private componentRef: HTMLElement;

  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
  }

  focus(): void {
    this.componentRef.focus();
  }

  private handleClick(): void {
    if (this.props.onSelect)
      this.props.onSelect(this.props.item);
  }

  private handleDoubleClick(): void {
    if (this.props.onAction)
      this.props.onAction(this.props.item);
  }

  private getIndentationLevel(): number {
    let indentationLevel = 0;

    let parent = this.props.item.parent;

    while (parent) {
      indentationLevel++;
      parent = parent.parent;
    }

    return indentationLevel;
  }

  render(): JSX.Element {
    let indentationLevel = this.getIndentationLevel();

    return (
      <tr className={classNames('table-row-component', 'table-row', { 'selected': this.props.isSelected })} tabIndex={0} onClick={this.handleClick} onDoubleClick={this.handleDoubleClick} ref={e => this.componentRef = e}>
        <td className="table-cell sid">
          <SidField sid={this.props.item.sid} bold={this.props.isSelected} />
        </td>
        <td className="table-cell title">
          {
            indentationLevel > 0 &&
              <span className="indentation" style={{paddingLeft: indentationLevel * 10}}></span>
          }
          {
            indentationLevel > 0 &&
              <span className="arrow"></span>
          }
          <TitleField title={this.props.item.title} status={TableRow.stateToStatus[this.props.item.state ? this.props.item.state.key : null]} />
          {
            (!this.props.item.state || this.props.item.state.key !== 'closed') &&
              <ItemPriorityIndicator className="priority-indicator" itemPriority={null} />
          }
        </td>
        <td className="table-cell project">
          <ProjectField project={this.props.item.project} />
        </td>
        <td className="table-cell type">
          <ItemTypeField itemType={this.props.item.type} />
        </td>
        <td className="table-cell state">
          <ItemStateField itemState={this.props.item.state} />
        </td>
        <td className="table-cell assigned-to">
          <UserField user={this.props.item.assignedTo} />
        </td>
        <td className="table-cell milestone">
          <MilestoneField milestone={this.props.item.milestone} />
        </td>
      </tr>
    );
  }
}
