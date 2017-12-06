import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Application, ISession } from './application';
import { Clipboard } from './framework/clipboard';
import { ContextManager } from './framework/context';
import { ActionManager } from './framework/actions';
import { CommandManager } from './framework/commands';
import { ItemControllerManager } from './framework/items';
import { ServiceManager } from './services';
import { ILocalStorage, LocalStorage, SessionStorage } from './framework/storage';
import App from './components/app';

declare var config: {
  api: {
    address: string;
  }
};

async function getApplication() {
  const localStorage = ServiceManager.Instance.getService<ILocalStorage>('ILocalStorage');
  const session = await localStorage.get<ISession>('session');

  const application = new Application({ address: config.api.address });
  await application.initialize(session);

  return application;
}

async function main() {
  ServiceManager.Instance = new ServiceManager();
  ServiceManager.Instance.registerService('ILocalStorage', new LocalStorage());
  ServiceManager.Instance.registerService('ISessionStorage', new SessionStorage());
  ServiceManager.Instance.registerService('IRoamingStorage', new LocalStorage());
  ServiceManager.Instance.registerService('IClipboard', new Clipboard());
  ServiceManager.Instance.registerService('IContextManager', new ContextManager());
  ServiceManager.Instance.registerService('IActionManager', new ActionManager());
  ServiceManager.Instance.registerService('ICommandManager', new CommandManager());
  ServiceManager.Instance.registerService('IItemControllerManager', new ItemControllerManager());
  ServiceManager.Instance.registerService('IApplication', await getApplication());

  ReactDOM.render(
    React.createElement(App),
    document.getElementById('app')
  );
}

main();
