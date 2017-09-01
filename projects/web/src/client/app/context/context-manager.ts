import { IContextManager } from './icontext-manager';
import { IContextProvider } from './icontext-provider';

export class ContextManager implements IContextManager {
  private contextProviders: IContextProvider[] = [];

  registerContextProvider(contextProvider: IContextProvider) {
    this.contextProviders.push(contextProvider);
  }

  unregisterContextProvider(contextProvider: IContextProvider) {
    this.contextProviders.splice(this.contextProviders.indexOf(contextProvider), 1);
  }

  getContext() {
    let context = {};

    for (const contextProvider of this.contextProviders)
      context = {...context, ...contextProvider.getContext()};

    return context;
  }
}
