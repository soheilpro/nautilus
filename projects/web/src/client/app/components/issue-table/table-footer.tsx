import * as React from 'react';
import { IIssue } from '../../application';

require('../../assets/stylesheets/base.less');
require('./table-footer.less');

interface ITableFooterProps {
  items: IIssue[];
}

interface ITableFooterState {
}

export class TableFooter extends React.PureComponent<ITableFooterProps, ITableFooterState> {
  render(): JSX.Element {
    return (
      <tr className="table-footer-component table-row">
        <td className="table-cell total">{this.props.items.length}</td>
        <td className="table-cell"></td>
        <td className="table-cell"></td>
        <td className="table-cell"></td>
        <td className="table-cell"></td>
        <td className="table-cell"></td>
        <td className="table-cell"></td>
      </tr>
    );
  }
}
