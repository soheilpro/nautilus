import * as React from 'react';

require('../../assets/stylesheets/base.less');
require('./window-content.less');

interface IWindowContentProps {
}

interface IWindowContentState {
}

export class WindowContent extends React.PureComponent<IWindowContentProps, IWindowContentState> {
  render(): JSX.Element {
    return (
      <div className="window-content-component">
        {this.props.children}
      </div>
    );
  }
};
