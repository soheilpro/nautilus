import * as React from 'react';
import * as classNames from 'classnames';
import { IItemPriority } from '../../application';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IItemPriorityFieldProps {
  itemPriority: IItemPriority;
  className?: string;
}

interface IItemPriorityFieldPriority {
}

export class ItemPriorityField extends React.PureComponent<IItemPriorityFieldProps, IItemPriorityFieldPriority> {
  render(): JSX.Element {
    if (!this.props.itemPriority)
      return null;

    return (
      <span className={classNames('item-priority-field-component', this.props.className)}>
        {this.props.itemPriority.title}
      </span>
    );
  }
}
