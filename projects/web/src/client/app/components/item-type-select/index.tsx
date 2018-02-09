import * as React from 'react';
import * as classNames from 'classnames';
import { IItemType } from '../../application';
import Select from '../select';

interface IItemTypeSelectProps {
  itemTypes?: IItemType[];
  itemType: IItemType;
  className?: string;
  onChange(itemType: IItemType): void;
}

interface IItemTypeSelectState {
}

export default class ItemTypeSelect extends React.PureComponent<IItemTypeSelectProps, IItemTypeSelectState> {
  constructor() {
    super();

    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  private handleSelectChange(itemType: IItemType) {
    this.props.onChange(itemType);
  }

  render() {
    return (
      <Select className={classNames('item-type-select-component', this.props.className)} selectedItem={this.props.itemType} items={this.props.itemTypes} displayProperty="title" onChange={this.handleSelectChange} />
    );
  }
};
