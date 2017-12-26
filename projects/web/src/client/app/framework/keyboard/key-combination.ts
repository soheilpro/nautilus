import { IKeyCombination } from './ikey-combination';
import { IShortcut } from './ishortcut';

export class KeyCombination {
  static matches(keyCombination: IKeyCombination, event: KeyboardEvent): boolean {
    if (keyCombination.keyCode !== event.keyCode)
      return false;

    if ((keyCombination.ctrlKey || false) !== event.ctrlKey)
      return false;

    if ((keyCombination.shiftKey || false) !== event.shiftKey)
      return false;

    if ((keyCombination.altKey || false) !== event.altKey)
      return false;

    if ((keyCombination.metaKey || false) !== event.metaKey)
      return false;

    return true;
  }

  static matchesSome(keyCombinations: IShortcut, events: KeyboardEvent[]): number {
    let i: number;

    for (i = 0; i < events.length; i++) {
      const keyCombination = keyCombinations[i];
      const event = events[i];

      if (!keyCombination)
        break;

      if (!this.matches(keyCombination, event))
        return 0;
    }

    return i;
  }
}
