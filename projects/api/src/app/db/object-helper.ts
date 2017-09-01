import * as _ from 'underscore';

export class ObjectHelper {
  public static cleanUp<T extends object>(object: T): T {
    const result = {...object as IObject};

    _.each(result, (value: any, key: string) => {
      if (value === undefined || (_.isObject(value) && _.isEmpty(value) && !_.isDate(value)))
        delete result[key];
    });

    return result as T;
  }

  public static cleanUpObject<T>(object: T): T {
    const result = {} as T;

    for (const key in object) {
      if (!object.hasOwnProperty(key))
        continue;

      let value = object[key];

      if (value === undefined)
        continue;

      if (_.isArray(value)) {
        result[key] = this.cleanUpArray(value);
      }
      else if (_.isObject(value)) {
        result[key] = this.cleanUpObject(value);
      }
      else {
        result[key] = value;
      }
    }

    return result;
  }

  public static cleanUpArray<T extends Array<any>>(array: T): T {
    const result = [] as T;

    for (const item of array) {
      if (item === undefined)
        continue;

      if (_.isArray(item)) {
        result.push(this.cleanUpArray(item));
      }
      else if (_.isObject(item)) {
        result.push(this.cleanUpObject(item));
      }
      else {
        result.push(item);
      }
    }

    return result;
  }
}
