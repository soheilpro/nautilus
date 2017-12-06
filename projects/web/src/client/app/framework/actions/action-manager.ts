import { IAction } from './iaction';
import { IActionManager } from './iaction-manager';

export class ActionManager implements IActionManager {
  private actions: IAction[] = [];

  getActions() {
    return this.actions;
  }

  async execute(action: IAction) {
    await action.execute();
    this.actions.push(action);
  }

  async undo() {
    throw new Error('Not implemented');
  }
}
