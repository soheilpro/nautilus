import { IStorage } from './istorage';
import { Promise } from 'axios';

export class BrowserStorage implements IStorage {
  constructor(private storage: Storage) {
  }

  set(key: string, value: Object): Promise<void> {
    this.storage.setItem(key, JSON.stringify(value));

    return Promise.resolve(undefined);
  }

  get<T>(key: string, defaultValue?: T): Promise<T> {
    const data = this.storage.getItem(key);
    const value = data ? JSON.parse(data) : defaultValue;

    return Promise.resolve(value);
  }

  remove(key: string): Promise<void> {
    this.storage.removeItem(key);

    return Promise.resolve(undefined);
  }
}
