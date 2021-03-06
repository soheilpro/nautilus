import * as React from 'react';

require('../../assets/stylesheets/base.less');
require('./table-header.less');

interface ITableHeaderProps {
}

interface ITableHeaderState {
}

export class TableHeader extends React.PureComponent<ITableHeaderProps, ITableHeaderState> {
  render(): JSX.Element {
    return (
      <tr className="table-header-component table-row">
        <td className="table-cell index">#</td>
        <td className="table-cell user">User</td>
        <td className="table-cell role">Role</td>
        <td className="table-cell project">Project</td>
      </tr>
    );
  }
}
