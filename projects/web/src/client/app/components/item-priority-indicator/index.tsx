import * as React from 'react';
import * as classNames from 'classnames';
import { IItemPriority } from '../../application';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IItemPriorityIndicatorProps {
  itemPriority: IItemPriority;
  className?: string;
}

interface IItemPriorityIndicatorState {
}

export class ItemPriorityIndicator extends React.PureComponent<IItemPriorityIndicatorProps, IItemPriorityIndicatorState> {
  render(): JSX.Element {
    if (!this.props.itemPriority)
      return null;

    return (
      <span className={classNames('item-priority-indicator-component', `priority-${this.props.itemPriority.key}`, this.props.className)}>
        {this.props.itemPriority.title}
      </span>
    );
  }
}
