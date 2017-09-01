import * as _ from 'underscore';
import * as React from 'react';
import { ICommandProvider, ICommand, ICommandController } from '../../commands';
import { KeyCombination, isInputEvent } from '../../keyboard';
import { ServiceManager } from '../../services';
import { IWindow } from '../../windows';
import CommandPaletteWindow from '../command-palette-window';
import ShowCommandPaletteCommand from './show-command-palette-command';

interface ICommandControllerProps {
}

interface ICommandControllerState {
}

export default class CommandController extends React.PureComponent<ICommandControllerProps, ICommandControllerState> implements ICommandController, ICommandProvider {
  private commandManager = ServiceManager.Instance.getCommandManager();
  private windowController = ServiceManager.Instance.getWindowController();
  private commandShortcutsDisabledCounter: number = 0;
  private keyboardEvents: KeyboardEvent[] = [];
  private commandPaletteWindow: IWindow;

  constructor() {
    super();

    this.handleDocumentKeyDown = this.handleDocumentKeyDown.bind(this);
    this.handleCommandPaletteWindowSelect = this.handleCommandPaletteWindowSelect.bind(this);

    this.state = {};
  }

  componentWillMount() {
    ServiceManager.Instance.setCommandController(this);
    this.commandManager.registerCommandProvider(this);
    document.addEventListener('keydown', this.handleDocumentKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleDocumentKeyDown);
    this.commandManager.unregisterCommandProvider(this);
    ServiceManager.Instance.setCommandController(undefined);
  }

  disableCommandShortcuts() {
    this.commandShortcutsDisabledCounter++;
  }

  enableCommandShortcuts() {
    this.commandShortcutsDisabledCounter--;
  }

  showCommandPaletteWindow() {
    const commands = _.sortBy(this.commandManager.getCommands().filter(command => command.visible), command => command.title);

    this.commandPaletteWindow = {
      content: <CommandPaletteWindow commands={commands} onSelect={this.handleCommandPaletteWindowSelect} />,
      top: 20,
      width: 600,
    };

    this.windowController.showWindow(this.commandPaletteWindow);
  }

  getCommands() {
    return [
      new ShowCommandPaletteCommand(),
    ];
  }

  private handleDocumentKeyDown(event: KeyboardEvent) {
    if (this.commandShortcutsDisabledCounter > 0)
      return;

    if (isInputEvent(event))
      return;

    this.keyboardEvents.push(event);

    // Starting from the event before the last event, if we encounter a stale event, remove that event and all events before that
    for (let i = this.keyboardEvents.length - 2; i >= 0; i--) {
      if (this.keyboardEvents[i + 1].timeStamp - this.keyboardEvents[i].timeStamp > 500) {
        this.keyboardEvents.splice(0, i + 1);
        break;
      }
    }

    // Find (fully of partially) matching commands
    const matchingCommands: ICommand[] = [];
    for (const command of this.commandManager.getCommands()) {
      if (!command.shortcut)
        continue;

      if (KeyCombination.matchesSome(command.shortcut, this.keyboardEvents) > 0)
        matchingCommands.push(command);
    }

    // No mathing command
    if (matchingCommands.length === 0) {

      // Reset events
      this.keyboardEvents = [];
    }
    // One matching command
    else if (matchingCommands.length === 1) {
      const command = matchingCommands[0];

      // Fully matching command
      if (command.shortcut.length === this.keyboardEvents.length) {
        if (command.enabled)
          this.commandManager.executeCommand(command.id);

        event.preventDefault();
        this.keyboardEvents = [];
      }
      else {
        // Partially matching command
        // Wait for more events
      }
    }
  }

  private handleCommandPaletteWindowSelect(command: ICommand) {
    this.windowController.closeWindow(this.commandPaletteWindow, () => {
      this.commandManager.executeCommand(command.id);
    });
  }

  render() {
    return (
      <div className="command-controller-component">
      </div>
    );
  }
};
