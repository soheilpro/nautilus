import * as React from 'react';
import { ICommand } from '../../commands';
import { Window } from '../window';
import { List } from '../list';
import { Shortcut } from '../shortcut';

require('../../assets/stylesheets/base.less');
require ('./index.less');

interface ICommandPaletteWindowProps {
  commands: ICommand[];
  onSelect(command: ICommand): void;
}

interface ICommandPaletteWindowState {
}

export class CommandPaletteWindow extends React.PureComponent<ICommandPaletteWindowProps, ICommandPaletteWindowState> {
  constructor() {
    super();

    this.handleListKeyForItem = this.handleListKeyForItem.bind(this);
    this.handleListTitleForItem = this.handleListTitleForItem.bind(this);
    this.handleListIsItemEnabled = this.handleListIsItemEnabled.bind(this);
    this.handleListRenderItem = this.handleListRenderItem.bind(this);
  }

  private handleListKeyForItem(command: ICommand): string {
    return command.id;
  }

  private handleListTitleForItem(command: ICommand): string {
    return command.title;
  }

  private handleListIsItemEnabled(command: ICommand): boolean {
    return command.isEnabled;
  }

  private handleListRenderItem(command: ICommand): JSX.Element {
    return (
      <span>
        <span className="title">
          {command.title}
        </span>
        <span className="shortcut">
          <Shortcut shortcut={command.shortcut} />
        </span>
      </span>
    );
  }

  render(): JSX.Element {
    return (
      <Window className="command-palette-window-component">
        <List className="list" items={this.props.commands} keyForItem={this.handleListKeyForItem} titleForItem={this.handleListTitleForItem} isItemEnabled={this.handleListIsItemEnabled} renderItem={this.handleListRenderItem} onSelect={this.props.onSelect} />
      </Window>
    );
  }
}
