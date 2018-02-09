import * as React from 'react';

require('../../assets/stylesheets/base.less');
require('./table-header.less');

interface ITableHeaderProps {
}

interface ITableHeaderState {
}

export default class TableHeader extends React.PureComponent<ITableHeaderProps, ITableHeaderState> {
  render() {
    return (
      <tr className="table-header-component table-row">
        <td className="table-cell sid">#</td>
        <td className="table-cell title">Title</td>
        <td className="table-cell project">Project</td>
        <td className="table-cell type">Type</td>
        <td className="table-cell state">State</td>
        <td className="table-cell assigned-to">Assigned To</td>
        <td className="table-cell milestone">Milestone</td>
      </tr>
    );
  }
};
