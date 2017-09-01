import { BrowserStorage } from './browser-storage';

export class SessionStorage extends BrowserStorage {
  constructor() {
    super(window.sessionStorage);
  }
}
