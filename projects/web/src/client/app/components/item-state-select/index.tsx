import * as React from 'react';
import * as classNames from 'classnames';
import { IItemState } from '../../application';
import { Select } from '../../framework/components/select';

interface IItemStateSelectProps {
  itemStates?: IItemState[];
  itemState: IItemState;
  className?: string;
  onChange(itemState: IItemState): void;
}

interface IItemStateSelectState {
}

export class ItemStateSelect extends React.PureComponent<IItemStateSelectProps, IItemStateSelectState> {
  render(): JSX.Element {
    return (
      <Select className={classNames('item-state-select-component', this.props.className)} selectedItem={this.props.itemState} items={this.props.itemStates} keyForItem={(item: IItemState) => item.id} titleForItem={(item: IItemState) => item.title} onChange={this.props.onChange} />
    );
  }
}
