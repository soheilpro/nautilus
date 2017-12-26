export function isInputEvent(event: KeyboardEvent): boolean {
  return (event.target as HTMLElement).nodeName === 'INPUT' ||
         (event.target as HTMLElement).nodeName === 'TEXTAREA';
}
