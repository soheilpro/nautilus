import * as _ from 'underscore';
import { IType } from './itype';
import { ITypeSystem } from './itype-system';

export class TypeSystem implements ITypeSystem {
  private types: IType[] = [];

  constructor() {
    this.registerType({ name: 'Boolean' });
    this.registerType({ name: 'Number' });
    this.registerType({ name: 'String' });
    this.registerType({ name: 'Entity' });
  }

  registerType(type: IType): void {
    this.types.push(type);
  }

  registerTypes(types: IType[]): void {
    this.types.push(...types);
  }

  getType(name: string): IType {
    return _.find(this.types, type => type.name === name);
  }

  getTypeHierarchy(type: IType): IType[] {
    const hierarchy: IType[] = [];

    while (type) {
      hierarchy.push(type);

      if (!type.base)
        break;

      type = _.find(this.types, _type => _type.name === type.base);
    }

    return hierarchy;
  }

  isOfType(type: IType, baseType: IType | string): boolean {
    if (typeof baseType === 'string')
      baseType = this.getType(baseType);

    return this.getTypeHierarchy(type).some(_type => _type.name === (baseType as IType).name);
  }

  getCommonType(type1: IType, type2: IType): IType {
    const type1Hierarchy = this.getTypeHierarchy(type1);
    const type2Hierarchy = this.getTypeHierarchy(type2);

    for (const t1 of type1Hierarchy)
      for (const t2 of type2Hierarchy)
        if (t1 === t2)
          return t1;

    return null;
  }
}
