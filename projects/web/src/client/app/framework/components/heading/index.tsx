import * as React from 'react';
import * as classNames from 'classnames';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IHeadingProps {
  level: number;
  className?: string;
}

interface IHeadingState {
}

export class Heading extends React.PureComponent<IHeadingProps, IHeadingState> {
  render(): JSX.Element {
    return (
      <div className={classNames('heading-component', { [`level-${this.props.level}`]: true }, this.props.className)}>
        {this.props.children}
      </div>
    );
  }
}
