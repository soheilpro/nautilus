declare interface IObject<T> {
  [key: string]: T;
}

declare interface IEventEmitter {
  on(event: string, listener: Function): void;
  off(event: string, listener: Function): void;
}
