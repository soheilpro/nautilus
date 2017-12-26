import * as _ from 'underscore';
import * as React from 'react';
import { ICommandProvider, ICommand, ICommandController, ICommandManager } from '../../commands';
import { IWindow, IWindowController } from '../../windows';
import { KeyCombination, isInputEvent } from '../../../framework/keyboard';
import { ServiceManager } from '../../../services';
import CommandPaletteWindow from '../command-palette-window';
import { ShowCommandPaletteCommand } from './commands';

interface ICommandControllerProps {
}

interface ICommandControllerState {
}

export default class CommandController extends React.PureComponent<ICommandControllerProps, ICommandControllerState> implements ICommandController, ICommandProvider {
  private commandManager = ServiceManager.Instance.getService<ICommandManager>('ICommandManager');
  private windowController = ServiceManager.Instance.getService<IWindowController>('IWindowController');
  private commandShortcutsDisabledCounter: number = 0;
  private keyboardEvents: KeyboardEvent[] = [];
  private commandPaletteWindow: IWindow;

  constructor() {
    super();

    this.handleDocumentKeyDown = this.handleDocumentKeyDown.bind(this);
    this.handleCommandPaletteWindowSelect = this.handleCommandPaletteWindowSelect.bind(this);

    this.state = {};
  }

  componentWillMount(): void {
    ServiceManager.Instance.registerService('ICommandController', this);
    this.commandManager.registerCommandProvider(this);
    document.addEventListener('keydown', this.handleDocumentKeyDown);
  }

  componentWillUnmount(): void {
    document.removeEventListener('keydown', this.handleDocumentKeyDown);
    this.commandManager.unregisterCommandProvider(this);
    ServiceManager.Instance.unregisterService('ICommandController', this);
  }

  disableCommandShortcuts(): void {
    this.commandShortcutsDisabledCounter++;
  }

  enableCommandShortcuts(): void {
    this.commandShortcutsDisabledCounter--;
  }

  showCommandPaletteWindow(): void {
    const commands = _.sortBy(this.commandManager.getCommands().filter(command => command.isAvailable && command.isVisible), command => command.title);

    this.commandPaletteWindow = {
      content: <CommandPaletteWindow commands={commands} onSelect={this.handleCommandPaletteWindowSelect} />,
      top: 20,
      width: 600,
    };

    this.windowController.showWindow(this.commandPaletteWindow);
  }

  getCommands(): ICommand[] {
    return [
      new ShowCommandPaletteCommand(),
    ];
  }

  private handleDocumentKeyDown(event: KeyboardEvent): void {
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
        if (command.isAvailable && command.isEnabled)
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

  private handleCommandPaletteWindowSelect(command: ICommand): void {
    this.windowController.closeWindow(this.commandPaletteWindow, () => {
      this.commandManager.executeCommand(command.id);
    });
  }

  render(): JSX.Element {
    return (
      <div className="command-controller-component">
      </div>
    );
  }
};
