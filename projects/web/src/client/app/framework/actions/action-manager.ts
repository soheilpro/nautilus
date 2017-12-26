import { IAction } from './iaction';
import { IActionManager } from './iaction-manager';

export class ActionManager implements IActionManager {
  private actions: IAction[] = [];

  getActions(): IAction[] {
    return this.actions;
  }

  async execute(action: IAction): Promise<void> {
    await action.execute();
    this.actions.push(action);
  }

  async undo(): Promise<void> {
    throw new Error('Not implemented');
  }
}
