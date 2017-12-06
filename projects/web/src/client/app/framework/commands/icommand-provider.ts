import { ICommand } from './icommand';

export interface ICommandProvider {
  getCommands(): ICommand[];
}
