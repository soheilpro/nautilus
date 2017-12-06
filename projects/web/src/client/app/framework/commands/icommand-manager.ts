import { ICommand } from './icommand';
import { ICommandProvider } from './icommand-provider';

export interface ICommandManager {
  registerCommandProvider(commandProvider: ICommandProvider): void;
  unregisterCommandProvider(commandProvider: ICommandProvider): void;
  getCommands(): ICommand[];
  executeCommand(commandId: string): void;
}
