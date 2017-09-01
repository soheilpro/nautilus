export function isInputEvent(event: KeyboardEvent) {
  return (event.target as HTMLElement).nodeName === 'INPUT' ||
         (event.target as HTMLElement).nodeName === 'TEXTAREA';
}
