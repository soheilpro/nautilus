import * as React from 'react';
import * as classNames from 'classnames';
import { IItemState } from '../../application';
import Select from '../select';

interface IItemStateSelectProps {
  itemStates?: IItemState[];
  itemState: IItemState;
  className?: string;
  onChange(itemState: IItemState): void;
}

interface IItemStateSelectState {
}

export default class ItemStateSelect extends React.PureComponent<IItemStateSelectProps, IItemStateSelectState> {
  constructor() {
    super();

    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  private handleSelectChange(itemState: IItemState) {
    this.props.onChange(itemState);
  }

  render() {
    return (
      <Select className={classNames('item-state-select-component', this.props.className)} selectedItem={this.props.itemState} items={this.props.itemStates} displayProperty="title" onChange={this.handleSelectChange} />
    );
  }
};
