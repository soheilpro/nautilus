import EventEmitter = require('wolfy87-eventemitter');
import { IModule } from './imodule';

export abstract class BaseModule extends EventEmitter implements IModule {
  load(): Promise<void> {
    return Promise.resolve();
  }
}
