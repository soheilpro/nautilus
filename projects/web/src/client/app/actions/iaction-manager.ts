import { IAction } from './iaction';

export interface IActionManager {
  getActions(): IAction[];
  execute(action: IAction): Promise<void>;
  undo(): Promise<void>;
}
