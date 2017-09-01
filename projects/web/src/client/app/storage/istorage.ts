export interface IStorage {
  set(key: string, value: Object): Promise<void>;
  get<T>(key: string, defaultValue?: T): Promise<T>;
  remove(key: string): Promise<void>;
}
