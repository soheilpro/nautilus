import * as React from 'react';

require('../../assets/stylesheets/base.less');
require('./window-action-bar.less');

interface IWindowActionBarProps {
}

interface IWindowActionBarState {
}

export class WindowActionBar extends React.PureComponent<IWindowActionBarProps, IWindowActionBarState> {
  render() {
    return (
      <div className="window-action-bar-component">
        <div className="line"></div>
        {this.props.children}
      </div>
    );
  }
};
