export interface IModule extends EventEmitter {
  load(): Promise<void>;
}
