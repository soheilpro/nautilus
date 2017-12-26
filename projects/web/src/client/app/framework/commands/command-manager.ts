import { ICommand } from './icommand';
import { ICommandManager } from './icommand-manager';
import { ICommandProvider } from './icommand-provider';

export class CommandManager implements ICommandManager {
  private commandProviders: ICommandProvider[] = [];

  registerCommandProvider(commandProvider: ICommandProvider): void {
    this.commandProviders.push(commandProvider);
  }

  unregisterCommandProvider(commandProvider: ICommandProvider): void {
    this.commandProviders.splice(this.commandProviders.indexOf(commandProvider), 1);
  }

  getCommands(): ICommand[] {
    const commands: ICommand[] = [];

    for (const commandProvider of this.commandProviders)
      for (const command of commandProvider.getCommands())
        if (command)
          commands.push(command);

    return commands;
  }

  executeCommand(commandId: string): void {
    for (const command of this.getCommands()) {
      if (command.id === commandId && command.isAvailable && command.isEnabled) {
        command.execute();
        return;
      }
    }

    throw new Error(`Command not found: ${commandId}`);
  }
}
