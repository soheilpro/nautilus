import * as React from 'react';
import * as classNames from 'classnames';
import { IUser } from '../../application';
import { ITableRow } from '../../framework/components/table';
import { NumberField } from '../number-field';
import { TextField } from '../text-field';

require('../../assets/stylesheets/base.less');
require('./table-row.less');

interface ITableRowProps {
  item: IUser;
  index: number;
  isSelected: boolean;
  onSelect?(item: IUser): void;
  onAction?(item: IUser): void;
}

interface ITableRowState {
}

export class TableRow extends React.PureComponent<ITableRowProps, ITableRowState> implements ITableRow {
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
        <td className="table-cell index">
          <NumberField number={this.props.index + 1} />
        </td>
        <td className="table-cell username">
          <TextField text={this.props.item.username} />
        </td>
        <td className="table-cell name">
          <TextField text={this.props.item.name} />
        </td>
        <td className="table-cell email">
          <TextField text={this.props.item.email} />
        </td>
      </tr>
    );
  }
}
