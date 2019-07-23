import * as React from 'react';
import * as classNames from 'classnames';
import { IItemPriority } from '../../application';
import { Select } from '../../framework/components/select';

interface IItemPrioritySelectProps {
  itemPriorities?: IItemPriority[];
  itemPriority: IItemPriority;
  className?: string;
  onChange(itemPriority: IItemPriority): void;
}

interface IItemPrioritySelectPriority {
}

export class ItemPrioritySelect extends React.PureComponent<IItemPrioritySelectProps, IItemPrioritySelectPriority> {
  render(): JSX.Element {
    return (
      <Select className={classNames('item-priority-select-component', this.props.className)} selectedItem={this.props.itemPriority} items={this.props.itemPriorities} keyForItem={(item: IItemPriority) => item.id} titleForItem={(item: IItemPriority) => item.title} onChange={this.props.onChange} />
    );
  }
}
