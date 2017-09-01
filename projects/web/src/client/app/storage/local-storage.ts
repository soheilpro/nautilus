import { BrowserStorage } from './browser-storage';

export class LocalStorage extends BrowserStorage {
  constructor() {
    super(window.localStorage);
  }
}
