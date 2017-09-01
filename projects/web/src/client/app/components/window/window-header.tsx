import * as React from 'react';

require('../../assets/stylesheets/base.less');
require('./window-header.less');

interface IWindowHeaderProps {
}

interface IWindowHeaderState {
}

export class WindowHeader extends React.PureComponent<IWindowHeaderProps, IWindowHeaderState> {
  render() {
    return (
      <div className="window-header-component">
        <span className="title">{this.props.children}</span>
      </div>
    );
  }
};
