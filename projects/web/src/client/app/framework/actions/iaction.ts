export interface IAction {
  execute(): Promise<void>;
}
