import * as React from 'react';
import * as classNames from 'classnames';
import { IProject } from '../../application';
import { ITableRow } from '../../framework/components/table';
import { NumberField } from '../number-field';
import { TextField } from '../text-field';

require('../../assets/stylesheets/base.less');
require('./table-row.less');

interface ITableRowProps {
  item: IProject;
  index: number;
  isSelected: boolean;
  onSelect?(item: IProject): void;
  onAction?(item: IProject): void;
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
        <td className="table-cell name">
          <TextField text={this.props.item.name} />
        </td>
        <td className="table-cell description">
          <TextField text={this.props.item.description} />
        </td>
      </tr>
    );
  }
}
