import * as _ from 'underscore';
import * as React from 'react';
import { ICommandProvider, ICommand, ICommandController, ICommandManager } from '../../commands';
import { IWindowController } from '../../windows';
import { KeyCombination, isInputEvent } from '../../../framework/keyboard';
import { ServiceManager } from '../../../services';
import { CommandPaletteWindow } from '../command-palette-window';
import { ShowCommandPaletteCommand } from './commands';

interface ICommandControllerProps {
}

interface ICommandControllerState {
}

export class CommandController extends React.PureComponent<ICommandControllerProps, ICommandControllerState> implements ICommandController, ICommandProvider {
  private commandManager = ServiceManager.Instance.getService<ICommandManager>('ICommandManager');
  private windowController = ServiceManager.Instance.getService<IWindowController>('IWindowController');
  private commandShortcutsDisabledCounter: number = 0;
  private keyboardEvents: KeyboardEvent[] = [];

  constructor() {
    super();

    this.handleDocumentKeyDown = this.handleDocumentKeyDown.bind(this);

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
    const handleSelect = (command: ICommand) => {
      this.windowController.closeWindow(handle, () => {
        this.commandManager.executeCommand(command.id);
      });
    };

    const commands = _.sortBy(this.commandManager.getCommands().filter(command => command.isAvailable && command.isVisible), command => command.title);

    const window = <CommandPaletteWindow commands={commands} onSelect={handleSelect} />;
    const options = {
      top: 20,
      width: 600,
    };

    const handle = this.windowController.showWindow(window, options);
  }

  getCommands(): ICommand[] {
    return [
      new ShowCommandPaletteCommand(this),
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

  render(): JSX.Element {
    return (
      <div className="command-controller-component">
      </div>
    );
  }
}
