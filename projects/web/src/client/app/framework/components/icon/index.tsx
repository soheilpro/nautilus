import * as React from 'react';
import * as classNames from 'classnames';

require('../../../../node_modules/font-awesome/less/font-awesome.less');
require('../../assets/stylesheets/base.less');
require('./index.less');

interface IIconProps {
  name: string;
  position?: 'before' | 'after';
  className?: string;
}

interface IIconState {
}

export default class Icon extends React.PureComponent<IIconProps, IIconState> {
  render(): JSX.Element {
    return (
      <i className={classNames('icon-component fa', 'fa-' + this.props.name, this.props.position, this.props.className)} aria-hidden="true"></i>
    );
  }
};
