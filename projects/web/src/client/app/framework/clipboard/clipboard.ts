import { IClipboard } from './iclipboard';

export class Clipboard implements IClipboard {
  copyText(text: string): void {
    const listener = (event: ClipboardEvent): void => {
      event.clipboardData.setData('text/plain', text);
      event.preventDefault();
    };

    document.addEventListener('copy', listener);
    document.execCommand('copy');
    document.removeEventListener('copy', listener);
  }
}
