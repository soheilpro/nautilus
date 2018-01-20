import * as React from 'react';
import * as classNames from 'classnames';
import { IItemType } from '../../application';
import { Select } from '../../framework/components/select';

interface IItemTypeSelectProps {
  itemTypes?: IItemType[];
  itemType: IItemType;
  className?: string;
  onChange(itemType: IItemType): void;
}

interface IItemTypeSelectState {
}

export class ItemTypeSelect extends React.PureComponent<IItemTypeSelectProps, IItemTypeSelectState> {
  render(): JSX.Element {
    return (
      <Select className={classNames('item-type-select-component', this.props.className)} selectedItem={this.props.itemType} items={this.props.itemTypes} keyForItem={(item: IItemType) => item.id} titleForItem={(item: IItemType) => item.title} onChange={this.props.onChange} />
    );
  }
}
