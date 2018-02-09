export class EntityHelper {
  public static isEntity(object: Object) {
    const propertyNames = Object.getOwnPropertyNames(object);

    return propertyNames.some(properyName => properyName === 'id');
  }

  public static isBareEntity(object: Object) {
    const propertyNames = Object.getOwnPropertyNames(object);

    return propertyNames.length === 1 && propertyNames[0] === 'id';
  }
}
