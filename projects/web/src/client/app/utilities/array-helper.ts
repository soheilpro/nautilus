import * as _ from 'underscore';

export default class ArrayHelper {
  static replaceElement<T>(items: T[], oldItem: T, newItem: T, comparer: (item1: T, item2: T) => boolean): T[] {
    items = [...items];
    items.splice(_.findIndex(items, _.partial(comparer, oldItem)), 1, newItem);

    return items;
  }

  static removeElement<T>(items: T[], item: T, comparer: (item1: T, item2: T) => boolean): T[] {
    items = [...items];
    items.splice(_.findIndex(items, _.partial(comparer, item)), 1);

    return items;
  }

  static toMap<T>(items: T[], keyFor: (item: T) => string): IObject<T> {
    const map: IObject<T> = {};

    for (const item of items)
      map[keyFor(item)] = item;

      return map;
  }
}
