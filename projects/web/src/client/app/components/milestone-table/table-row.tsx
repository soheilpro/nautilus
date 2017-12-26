import * as React from 'react';
import * as classNames from 'classnames';
import { IMilestone } from '../../application';
import { ITableRow } from '../../framework/components/table';
import ItemStateField from '../item-state-field';
import ProjectField from '../project-field';
import SidField from '../sid-field';
import TitleField from '../title-field';

require('../../assets/stylesheets/base.less');
require('./table-row.less');

interface ITableRowProps {
  item: IMilestone;
  index: number;
  isSelected: boolean;
  onSelect?(item: IMilestone): void;
  onAction?(item: IMilestone): void;
}

interface ITableRowState {
}

export default class TableRow extends React.PureComponent<ITableRowProps, ITableRowState> implements ITableRow {
  private static stateToStatus: { [key: string]: string } = {
    'planned': 'pending',
    'inprogress': 'inprogress',
    'finished': 'finished',
    'closed': 'closed',
  };

  private componentElement: HTMLElement;

  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
  }

  focus(): void {
    this.componentElement.focus();
  }

  private handleClick(): void {
    if (this.props.onSelect)
      this.props.onSelect(this.props.item);
  }

  private handleDoubleClick(): void {
    if (this.props.onAction)
      this.props.onAction(this.props.item);
  }

  render(): JSX.Element {
    return (
      <tr className={classNames('table-row-component', 'table-row', { 'selected': this.props.isSelected })} tabIndex={0} onClick={this.handleClick} onDoubleClick={this.handleDoubleClick} ref={e => this.componentElement = e}>
        <td className="table-cell sid">
          <SidField sid={this.props.item.sid} bold={this.props.isSelected} />
        </td>
        <td className="table-cell project">
          <ProjectField project={this.props.item.project} />
        </td>
        <td className="table-cell title">
          <TitleField title={this.props.item.title} status={TableRow.stateToStatus[this.props.item.state ? this.props.item.state.key : null]} />
        </td>
        <td className="table-cell state">
          <ItemStateField itemState={this.props.item.state} />
        </td>
      </tr>
    );
  }
};
