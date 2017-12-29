import * as React from 'react';
import * as classNames from 'classnames';
import { IItemState } from '../../application';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IItemStateFieldProps {
  itemState: IItemState;
  className?: string;
}

interface IItemStateFieldState {
}

export class ItemStateField extends React.PureComponent<IItemStateFieldProps, IItemStateFieldState> {
  render(): JSX.Element {
    if (!this.props.itemState)
      return null;

    return (
      <span className={classNames('item-state-field-component', this.props.className)}>
        {this.props.itemState.title}
      </span>
    );
  }
}
