import { IAction } from './iaction';

export abstract class BaseAction implements IAction {
  abstract execute(): Promise<void>;
}
