import * as _ from 'underscore';
import * as React from 'react';
import * as classNames from 'classnames';
import { ICommand } from '../../commands';
import { KeyCode } from '../../../framework/keyboard';
import { Window } from '../window';
import { Input } from '../input';
import { Shortcut } from '../shortcut';

require('../../assets/stylesheets/base.less');
require ('./index.less');

interface ICommandPaletteWindowProps {
  commands: ICommand[];
  onSelect(command: ICommand): void;
}

interface ICommandPaletteWindowState {
  commands?: ICommand[];
  activeCommandIndex?: number;
  searchText?: string;
}

export class CommandPaletteWindow extends React.PureComponent<ICommandPaletteWindowProps, ICommandPaletteWindowState> {
  constructor(props: ICommandPaletteWindowProps) {
    super(props);

    this.handleContainerKeyDown = this.handleContainerKeyDown.bind(this);
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
    this.handleCommandListMouseLeave = this.handleCommandListMouseLeave.bind(this);
    this.handleCommandMouseEnter = this.handleCommandMouseEnter.bind(this);
    this.handleCommandClick = this.handleCommandClick.bind(this);

    this.state = {
      commands: props.commands,
      activeCommandIndex: -1,
    };
  }

  private handleContainerKeyDown(event: React.KeyboardEvent<HTMLDivElement>): void {
    if (event.which === KeyCode.DownArrow) {
      event.preventDefault();

      this.setState(state => {
        return {
          activeCommandIndex: state.activeCommandIndex < state.commands.length - 1 ? state.activeCommandIndex + 1 : 0,
        };
      });
    }
    else if (event.which === KeyCode.UpArrow) {
      event.preventDefault();

      this.setState(state => {
        return {
          activeCommandIndex: state.activeCommandIndex > 0 ? state.activeCommandIndex - 1 : state.commands.length - 1,
        };
      });
    }
    else if (event.which === KeyCode.Enter) {
      event.preventDefault();

      if (this.state.commands.length > 0) {
        if (this.state.activeCommandIndex !== -1) {
          const command = this.state.commands[this.state.activeCommandIndex];

          if (command.isEnabled)
            this.props.onSelect(command);
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
      commands: this.filterCommands(this.props.commands, value),
      activeCommandIndex: value ? 0 : -1,
    });
  }

  private handleCommandListMouseLeave(): void {
    this.setState({
      activeCommandIndex: -1,
    });
  }

  private handleCommandMouseEnter(command: ICommand): void {
    this.setState(state => {
      return {
        activeCommandIndex: state.commands.indexOf(command),
      };
    });
  }

  private handleCommandClick(command: ICommand, event: React.MouseEvent<HTMLAnchorElement>): void {
    event.preventDefault();

    if (command.isEnabled)
      this.props.onSelect(command);
  }

  private filterCommands(commands: ICommand[], text: string): ICommand[] {
    if (!text)
      return commands;

    text = text.toLowerCase();

    return commands.filter(command => command.title.toLowerCase().indexOf(text) !== -1);
  }

  render(): JSX.Element {
    return (
      <Window className="command-palette-window-component">
        <div className="container" onKeyDown={this.handleContainerKeyDown}>
          <Input className="search-input" placeholder="Search commands" value={this.state.searchText} autoFocus={true} onChange={this.handleSearchInputChange} />
          {
            this.state.commands.length > 0 ?
              <div className="command-list" onMouseLeave={this.handleCommandListMouseLeave}>
                {
                  this.state.commands.map((command, index) => {
                    return (
                      <a className={classNames('command', { 'disabled': !command.isEnabled, 'active': index === this.state.activeCommandIndex })} href="#" onClick={_.partial(this.handleCommandClick, command)} onMouseEnter={_.partial(this.handleCommandMouseEnter, command)} key={command.id}>
                        <span className="title">
                          {command.title}
                        </span>
                        <span className="shortcut">
                          <Shortcut shortcut={command.shortcut} />
                        </span>
                      </a>
                    );
                  })
                }
              </div>
              :
              <div className="no-commands-found">
                No commands found.
              </div>
          }
        </div>
      </Window>
    );
  }
}
