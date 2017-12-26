import { IContextManager } from './icontext-manager';
import { IContextProvider } from './icontext-provider';
import { IContext } from './icontext';

export class ContextManager implements IContextManager {
  private contextProviders: IContextProvider[] = [];

  registerContextProvider(contextProvider: IContextProvider): void {
    this.contextProviders.push(contextProvider);
  }

  unregisterContextProvider(contextProvider: IContextProvider): void {
    this.contextProviders.splice(this.contextProviders.indexOf(contextProvider), 1);
  }

  getContext(): IContext {
    let context = {};

    for (const contextProvider of this.contextProviders)
      context = {...context, ...contextProvider.getContext()};

    return context;
  }
}
