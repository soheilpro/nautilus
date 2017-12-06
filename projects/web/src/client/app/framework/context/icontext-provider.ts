import { IContext } from './icontext';

export interface IContextProvider {
  getContext(): IContext;
}
