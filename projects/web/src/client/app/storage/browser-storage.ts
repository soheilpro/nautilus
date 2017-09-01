import { IStorage } from './istorage';

export class BrowserStorage implements IStorage {
  constructor(private storage: Storage) {
  }

  set(key: string, value: Object) {
    this.storage.setItem(key, JSON.stringify(value));

    return Promise.resolve();
  }

  get<T>(key: string, defaultValue?: T) {
    const data = this.storage.getItem(key);
    const value = data ? JSON.parse(data) : defaultValue;

    return Promise.resolve(value);
  }

  remove(key: string) {
    this.storage.removeItem(key);

    return Promise.resolve();
  }
}
