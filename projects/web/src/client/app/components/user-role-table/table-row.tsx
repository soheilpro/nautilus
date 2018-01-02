import * as React from 'react';
import * as classNames from 'classnames';
import { IUserRole } from '../../application';
import { ITableRow } from '../../framework/components/table';
import { NumberField } from '../number-field';
import { TextField } from '../text-field';
import { UserField } from '../user-field';
import { ProjectField } from '../project-field';

require('../../assets/stylesheets/base.less');
require('./table-row.less');

interface ITableRowProps {
  item: IUserRole;
  index: number;
  isSelected: boolean;
  onSelect?(item: IUserRole): void;
  onAction?(item: IUserRole): void;
}

interface ITableRowState {
}

export class TableRow extends React.PureComponent<ITableRowProps, ITableRowState> implements ITableRow {
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

  render(): JSX.Element {
    return (
      <tr className={classNames('table-row-component', 'table-row', { 'selected': this.props.isSelected })} tabIndex={0} onClick={this.handleClick} onDoubleClick={this.handleDoubleClick} ref={e => this.componentRef = e}>
        <td className="table-cell index">
          <NumberField number={this.props.index + 1} />
        </td>
        <td className="table-cell user">
          <UserField user={this.props.item.user} />
        </td>
        <td className="table-cell name">
          <TextField text={this.props.item.role} />
        </td>
        <td className="table-cell description">
          <ProjectField project={this.props.item.project} />
        </td>
      </tr>
    );
  }
}
