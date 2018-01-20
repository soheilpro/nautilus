import * as React from 'react';
import { IItemState } from '../../application';
import { Window } from '../../framework/components/window';
import { Heading } from '../../framework/components/heading';
import { List } from '../../framework/components/list';
import { ItemStateField } from '../item-state-field';

require('../../assets/stylesheets/base.less');
require ('./index.less');

interface IItemStatePaletteWindowProps {
  itemStates: IItemState[];
  onSelect(itemState: IItemState): void;
}

interface IItemStatePaletteWindowState {
}

export class ItemStatePaletteWindow extends React.PureComponent<IItemStatePaletteWindowProps, IItemStatePaletteWindowState> {
  constructor() {
    super();

    this.handleListRenderItem = this.handleListRenderItem.bind(this);
  }

  private handleListRenderItem(itemState: IItemState): JSX.Element {
    return (
      <ItemStateField itemState={itemState} />
    );
  }

  render(): JSX.Element {
    return (
      <Window className="item-state-palette-window-component">
        <Heading className="heading" level={1}>Set issue state to</Heading>
        <List className="list" items={this.props.itemStates} keyForItem={(itemState: IItemState) => itemState.id} titleForItem={(itemState: IItemState) => itemState.title} renderItem={this.handleListRenderItem} onSelect={this.props.onSelect} />
      </Window>
    );
  }
}
