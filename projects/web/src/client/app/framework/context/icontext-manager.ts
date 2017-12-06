import { IContext } from './icontext';
import { IContextProvider } from './icontext-provider';

export interface IContextManager {
  registerContextProvider(contextProvider: IContextProvider): void;
  unregisterContextProvider(contextProvider: IContextProvider): void;
  getContext(): IContext;
}
