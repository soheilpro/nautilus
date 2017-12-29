import * as React from 'react';
import { IItem } from './iitem';

interface ITableRowProps {
  item: IItem;
  index: number;
  isSelected: boolean;
  onSelect?(item: IItem): void;
  onAction?(item: IItem): void;
}

interface ITableRowState {
}

export interface ITableRow {
  focus(): void;
}

export class TableRow extends React.Component<ITableRowProps, ITableRowState> {
  focus(): void {
  }
}
