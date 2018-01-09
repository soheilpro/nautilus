import * as _ from 'underscore';
import * as React from 'react';
import * as classNames from 'classnames';
import { IUser } from '../../application';
import { KeyCode } from '../../framework/keyboard';
import { Window } from '../../framework/components/window';
import { Heading } from '../../framework/components/heading';
import { Input } from '../../framework/components/input';

require('../../assets/stylesheets/base.less');
require ('./index.less');

interface IUserPaletteWindowProps {
  users: IUser[];
  onSelect(user: IUser): void;
}

interface IUserPaletteWindowState {
  users?: IUser[];
  activeUserIndex?: number;
  searchText?: string;
}

export class UserPaletteWindow extends React.PureComponent<IUserPaletteWindowProps, IUserPaletteWindowState> {
  constructor(props: IUserPaletteWindowProps) {
    super(props);

    this.handleContainerKeyDown = this.handleContainerKeyDown.bind(this);
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
    this.handleUserListMouseLeave = this.handleUserListMouseLeave.bind(this);
    this.handleUserMouseEnter = this.handleUserMouseEnter.bind(this);
    this.handleUserClick = this.handleUserClick.bind(this);

    this.state = {
      users: props.users,
      activeUserIndex: -1,
    };
  }

  private handleContainerKeyDown(event: React.KeyboardEvent<HTMLDivElement>): void {
    if (event.which === KeyCode.DownArrow) {
      event.preventDefault();

      this.setState(state => {
        return {
          activeUserIndex: state.activeUserIndex < state.users.length - 1 ? state.activeUserIndex + 1 : 0,
        };
      });
    }
    else if (event.which === KeyCode.UpArrow) {
      event.preventDefault();

      this.setState(state => {
        return {
          activeUserIndex: state.activeUserIndex > 0 ? state.activeUserIndex - 1 : state.users.length - 1,
        };
      });
    }
    else if (event.which === KeyCode.Enter) {
      event.preventDefault();

      if (this.state.users.length > 0) {
        if (this.state.activeUserIndex !== -1) {
          const user = this.state.users[this.state.activeUserIndex];

          this.props.onSelect(user);
        }
      }
    }
  }

  private handleSearchInputChange(value: string): void {
    this.setState({
      searchText: value,
    });

    value = value.trim();

    this.setState({
      users: this.filterUsers(this.props.users, value),
      activeUserIndex: value ? 0 : -1,
    });
  }

  private handleUserListMouseLeave(): void {
    this.setState({
      activeUserIndex: -1,
    });
  }

  private handleUserMouseEnter(user: IUser): void {
    this.setState(state => {
      return {
        activeUserIndex: state.users.indexOf(user),
      };
    });
  }

  private handleUserClick(user: IUser, event: React.MouseEvent<HTMLAnchorElement>): void {
    event.preventDefault();

    this.props.onSelect(user);
  }

  private filterUsers(users: IUser[], text: string): IUser[] {
    if (!text)
      return users;

    text = text.toLowerCase();

    return users.filter(user => user.name.toLowerCase().indexOf(text) !== -1);
  }

  render(): JSX.Element {
    return (
      <Window className="user-palette-window-component">
        <div className="container" onKeyDown={this.handleContainerKeyDown}>
          <Heading className="heading" level={1}>Assign issue to</Heading>
          <Input className="search-input" placeholder="Search users" value={this.state.searchText} autoFocus={true} onChange={this.handleSearchInputChange} />
          {
            this.state.users.length > 0 ?
              <div className="user-list" onMouseLeave={this.handleUserListMouseLeave}>
                {
                  this.state.users.map((user, index) => {
                    return (
                      <a className={classNames('user', { 'active': index === this.state.activeUserIndex })} href="#" onClick={_.partial(this.handleUserClick, user)} onMouseEnter={_.partial(this.handleUserMouseEnter, user)} key={user.id}>
                        <span className="title">
                          {user.name}
                        </span>
                      </a>
                    );
                  })
                }
              </div>
              :
              <div className="no-users-found">
                No users found.
              </div>
          }
        </div>
      </Window>
    );
  }
}
