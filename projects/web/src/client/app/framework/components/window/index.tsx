import * as React from 'react';
import * as classNames from 'classnames';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IWindowProps {
  className?: string;
}

interface IWindowState {
}

export default class Window extends React.PureComponent<IWindowProps, IWindowState> {
  render() {
    return (
      <div className={classNames('window-component', this.props.className)}>
        {this.props.children}
      </div>
    );
  }
};

export * from './window-action-bar'
export * from './window-content'
export * from './window-container'
export * from './window-header'
