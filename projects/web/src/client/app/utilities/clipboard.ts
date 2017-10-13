export default class Clipboard {
  static copyText(text: string) {
    const listener = (event: ClipboardEvent) => {
      event.clipboardData.setData('text/plain', text);
      event.preventDefault();
    };

    document.addEventListener('copy', listener);
    document.execCommand('copy');
    document.removeEventListener('copy', listener);
  };
}
