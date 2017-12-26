import * as React from 'react';
import * as classNames from 'classnames';
import Icon from '../../framework/components/icon';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IItemPriorityIndicatorProps {
  itemPriority: any;
  className?: string;
}

interface IItemPriorityIndicatorState {
}

export default class ItemPriorityIndicator extends React.PureComponent<IItemPriorityIndicatorProps, IItemPriorityIndicatorState> {
  render(): JSX.Element {
    if (!this.props.itemPriority)
      return null;

    const icons: {[key: string]: string} = {
      'important': 'exclamation',
      'critical': 'bolt',
    };

    const icon = icons[this.props.itemPriority.key];

    if (!icon)
      return null;

    return (
      <span className={classNames('item-priority-indicator-component', `priority-${this.props.itemPriority.key}`, this.props.className)}>
        <Icon name={icon} />
      </span>
    );
  }
};
