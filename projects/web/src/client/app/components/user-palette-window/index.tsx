import * as React from 'react';
import { IUser } from '../../application';
import { Window } from '../../framework/components/window';
import { Heading } from '../../framework/components/heading';
import { List } from '../../framework/components/list';
import { UserField } from '../user-field';

require('../../assets/stylesheets/base.less');
require ('./index.less');

interface IUserPaletteWindowProps {
  users: IUser[];
  onSelect(user: IUser): void;
}

interface IUserPaletteWindowState {
}

export class UserPaletteWindow extends React.PureComponent<IUserPaletteWindowProps, IUserPaletteWindowState> {
  constructor() {
    super();

    this.handleListRenderItem = this.handleListRenderItem.bind(this);
  }

  private handleListRenderItem(user: IUser): JSX.Element {
    return (
      <UserField user={user} />
    );
  }

  render(): JSX.Element {
    return (
      <Window className="user-palette-window-component">
        <Heading className="heading" level={1}>Assign issue to</Heading>
        <List className="list" items={this.props.users} keyForItem={(user: IUser) => user.id} titleForItem={(user: IUser) => user.name} renderItem={this.handleListRenderItem} onSelect={this.props.onSelect} />
      </Window>
    );
  }
}
