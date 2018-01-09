import * as React from 'react';
import { Heading } from '../heading';

require('../../assets/stylesheets/base.less');
require('./window-header.less');

interface IWindowHeaderProps {
}

interface IWindowHeaderState {
}

export class WindowHeader extends React.PureComponent<IWindowHeaderProps, IWindowHeaderState> {
  render(): JSX.Element {
    return (
      <div className="window-header-component">
        <Heading level={1}>{this.props.children}</Heading>
      </div>
    );
  }
}
