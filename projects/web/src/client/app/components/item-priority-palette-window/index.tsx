import * as React from 'react';
import { IItemPriority } from '../../application';
import { Window } from '../../framework/components/window';
import { Heading } from '../../framework/components/heading';
import { List } from '../../framework/components/list';
import { ItemPriorityField } from '../item-priority-field';

require('../../assets/stylesheets/base.less');
require ('./index.less');

interface IItemPriorityPaletteWindowProps {
  itemPriorities: IItemPriority[];
  onSelect(itemPriority: IItemPriority): void;
}

interface IItemPriorityPaletteWindowPriority {
}

export class ItemPriorityPaletteWindow extends React.PureComponent<IItemPriorityPaletteWindowProps, IItemPriorityPaletteWindowPriority> {
  constructor() {
    super();

    this.handleListRenderItem = this.handleListRenderItem.bind(this);
  }

  private handleListRenderItem(itemPriority: IItemPriority): JSX.Element {
    return (
      <ItemPriorityField itemPriority={itemPriority} />
    );
  }

  render(): JSX.Element {
    return (
      <Window className="item-priority-palette-window-component">
        <Heading className="heading" level={1}>Set issue priority to</Heading>
        <List className="list" items={this.props.itemPriorities} keyForItem={(itemPriority: IItemPriority) => itemPriority.id} titleForItem={(itemPriority: IItemPriority) => itemPriority.title} renderItem={this.handleListRenderItem} onSelect={this.props.onSelect} />
      </Window>
    );
  }
}
